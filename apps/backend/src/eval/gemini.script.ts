import { DATASET } from './constants';
import { configDotenv } from 'dotenv';
configDotenv();

// --- Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''; // Get API key from environment variable
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const BASE_MODEL = 'models/gemini-1.5-flash-001-tuning'; // Base model for tuning
const MAX_OUTPUT_LENGTH = 4096; // Maximum character count for the output as per API error

const coverLetterDataset = DATASET;

/**
 * Formats resume information into a readable string for the model input.
 * @param resumeInfo The resume_info object from the dataset.
 * @returns A formatted string representation of the resume.
 */
function formatResumeInfo(resumeInfo: any): string {
  let formatted = '--- RESUME INFO ---\n';

  if (resumeInfo.education && resumeInfo.education.length > 0) {
    formatted += 'Education:\n';
    resumeInfo.education.forEach((edu: any) => {
      formatted += `- ${edu.degree || ''} ${edu.major || ''} from ${edu.institution || ''} (${edu.status || ''})\n`;
    });
  }

  if (resumeInfo.coursework && resumeInfo.coursework.length > 0) {
    formatted += 'Relevant Coursework: ' + resumeInfo.coursework.join(', ') + '\n';
  }

  if (resumeInfo.work_experience && resumeInfo.work_experience.length > 0) {
    formatted += 'Work Experience:\n';
    resumeInfo.work_experience.forEach((exp: any) => {
      formatted += `- ${exp.title || ''} at ${exp.company || ''}: ${exp.description || ''}\n`;
    });
  }

  if (resumeInfo.leadership_roles && resumeInfo.leadership_roles.length > 0) {
    formatted += 'Leadership Roles:\n';
    resumeInfo.leadership_roles.forEach((role: any) => {
      formatted += `- ${role.role || ''} at ${role.organization || ''}: ${role.description || ''}\n`;
    });
  }

  if (resumeInfo.projects && resumeInfo.projects.length > 0) {
    formatted += 'Projects:\n';
    resumeInfo.projects.forEach((project: any) => {
      formatted += `- ${project.name || ''}: ${project.description || ''}\n`;
    });
  }

  if (resumeInfo.technical_skills && resumeInfo.technical_skills.length > 0) {
    formatted += 'Technical Skills: ' + resumeInfo.technical_skills.join(', ') + '\n';
  }

  if (resumeInfo.soft_skills && resumeInfo.soft_skills.length > 0) {
    formatted += 'Soft Skills: ' + resumeInfo.soft_skills.join(', ') + '\n';
  }

  if (resumeInfo.awards_achievements && resumeInfo.awards_achievements.length > 0) {
    formatted += 'Awards & Achievements: ' + resumeInfo.awards_achievements.join(', ') + '\n';
  }

  if (resumeInfo.interests && resumeInfo.interests.length > 0) {
    formatted += 'Interests: ' + resumeInfo.interests.join(', ') + '\n';
  }

  formatted += '--- END RESUME INFO ---\n';
  return formatted;
}

// Transform the coverLetterDataset into the required tuning examples format
const tuningExamples = coverLetterDataset.map((entry) => {
  const textInput = `--- JOB DESCRIPTION ---\n${entry.job_description}\n\n${formatResumeInfo(entry.resume_info)}`;
  let output = entry.expected_cover_letter;

  // Truncate output if it exceeds the maximum allowed length
  if (output.length > MAX_OUTPUT_LENGTH) {
    console.warn(`Warning: Output for an example was truncated from ${output.length} to ${MAX_OUTPUT_LENGTH} characters.`);
    output = output.substring(0, MAX_OUTPUT_LENGTH);
  }

  return {
    text_input: textInput,
    output: output,
  };
});

// Define the tuning request payload
const tuningPayload = {
  display_name: 'cover_letter_generator_model', // Changed model name to reflect new task
  base_model: BASE_MODEL,
  tuning_task: {
    hyperparameters: {
      batch_size: 4, // Changed batch_size to 4 (minimum allowed)
      learning_rate: 0.001,
      epoch_count: 5,
    },
    training_data: {
      examples: {
        examples: tuningExamples, // Use the transformed examples here
      },
    },
  },
};

// --- Helper Functions ---

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Makes an HTTP request and handles potential errors.
 * @param url The URL to fetch.
 * @param options Fetch options (method, headers, body).
 * @returns The JSON response.
 */
async function makeRequest(url: string, options: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error; // Re-throw to propagate the error
  }
}

// --- Main Tuning Logic ---

async function tuneModel() {
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set. Please set it as an environment variable or replace it in the script.');
    return;
  }

  // Add a check for DATASET availability
  if (typeof DATASET === 'undefined' || !Array.isArray(DATASET) || DATASET.length === 0) {
    console.error(
      "Error: 'DATASET' is not defined or is empty. Please ensure your cover letter dataset is loaded into the 'DATASET' variable.",
    );
    return;
  }

  console.log('Initiating model tuning...');

  // 1. Initiate the tuning job (POST request)
  let tunemodelResponse;
  try {
    tunemodelResponse = await makeRequest(`${BASE_URL}/tunedModels?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tuningPayload),
    });
  } catch (error) {
    console.error('Failed to initiate tuning job.');
    return;
  }

  const operationName = tunemodelResponse.name;
  if (!operationName) {
    console.error("Error: 'name' field not found in initial tuning response.", tunemodelResponse);
    return;
  }
  console.log(`Tuning operation started: ${operationName}`);

  // 2. Poll for status updates during training (GET request)
  let tuningDone = false;
  let tunedModelName: string | undefined;

  while (!tuningDone) {
    await sleep(5000); // Wait for 5 seconds before polling again

    let tuningOperationResponse;
    try {
      tuningOperationResponse = await makeRequest(
        `${BASE_URL.replace('/v1beta', '/v1')}/${operationName}?key=${GEMINI_API_KEY}`, // Note: operation polling uses v1
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } catch (error) {
      console.error('Failed to fetch tuning operation status. Retrying...');
      continue; // Continue polling even if one request fails
    }

    const completedPercent = tuningOperationResponse.metadata?.completedPercent || 0;
    tuningDone = tuningOperationResponse.done || false;

    // Clear previous line and print current progress (simple version for Node.js console)
    // In a full application, you might use a more sophisticated terminal library or UI update.
    process.stdout.write(`\rTuning...${completedPercent}%`);

    if (tuningDone) {
      tunedModelName = tuningOperationResponse.metadata?.tunedModel;
      if (!tunedModelName) {
        console.error("\nError: 'tunedModel' not found in completed operation metadata.", tuningOperationResponse);
        return;
      }
      console.log('\nTuning complete!');
    }
  }

  // 3. Get the TunedModel and check its state.
  // The model is ready to use if the state is active.
  console.log(`Fetching final state of tuned model: ${tunedModelName}`);
  let tunedModelResponse;
  try {
    tunedModelResponse = await makeRequest(`${BASE_URL}/${tunedModelName}?key=${GEMINI_API_KEY}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch tuned model details.');
    return;
  }

  const modelState = tunedModelResponse.state;
  console.log(`Tuned Model State: ${modelState}`);
  console.log('Full Tuned Model Details:', JSON.stringify(tunedModelResponse, null, 2));

  return tunedModelResponse;
}

// Execute the main function
tuneModel().catch(console.error);
