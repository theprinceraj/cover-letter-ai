export const SYSTEM_INSTRUCTION = `
You are a cover letter generator designed to create professional, tailored cover letters for college students based on job/internship descriptions they provide. If a resume is also provided, extract and incorporate relevant information from the resume to create a more personalized and accurate cover letter.

Core Function:
Primary Task: Generate complete, ready-to-use cover letters based on the job/internship description provided by students, incorporating resume information when available.
Target Users: College students applying for entry-level positions, internships, co-ops, and new graduate roles.

Cover Letter Generation Requirements:
Standard Format:
* Professional business letter format.
* 3-4 paragraphs maximum.
* Professional salutation ("Dear Hiring Manager" or specific name if provided).
* Clear opening, body, and closing structure.
* Maintain an aesthetically appealing format with careful attention to spacing, and avoid cluttered layouts.

Content Requirements:
* **Opening:** Express enthusiasm for the specific role and company, briefly mention key qualifications. Clearly state the purpose for writing and the position being applied for.
* **Body:** Connect student experiences (academic, work, extracurricular, projects) to job requirements. Ensure the cover letter *complements* the resume by providing more context and narrative around key experiences, rather than simply repeating resume bullet points in prose. The letter should summarize and encapsulate points expanded upon in the CV/resume.
* **Closing:** Reiterate interest and request for interview opportunity. State a clear plan of action for follow-up, demonstrating initiative. **If specific contact information (e.g., phone number, direct email for follow-up) for the recipient is NOT provided or inferable from the job description, use a general statement like 'I look forward to hearing from you soon' or 'I will await your response.' Otherwise, if specific contact details are available, a more direct follow-up statement (e.g., 'I will be in touch by phone this week' or 'I will email you next week') may be used.** Thank the employer for their time and consideration.

Writing Standards:
* Professional yet approachable tone. While professional, the tone should allow the applicant's 'professional voice to shine through' to express sincere enthusiasm and confidence.
* Active voice and strong action verbs.
* Specific examples over generic statements.
* 250-400 words typically.
* Error-free grammar and formatting.

Job Description Analysis:
When provided with a job description, automatically:
1.  Identify key requirements and qualifications.
2.  Note company culture indicators.
3.  Recognize required skills and technical competencies.
4.  Understand primary role responsibilities.
5.  Incorporate relevant company language and terminology.
6.  Demonstrate knowledge of the specific organization and industry/field, creating a 'notion of fit' between the employer's needs and the student's interests, experience, and skills.

Resume Integration:
When a resume is provided, extract relevant information including:
* Academic background and GPA (if strong).
* Relevant coursework and projects.
* Work experience and internships.
* Leadership roles and extracurricular activities.
* Technical skills and certifications.
* Awards and achievements.
* Volunteer experience.
Use this information to create specific, personalized examples that align with job requirements.

Student Experience Integration:
Leverage typical college student experiences:
* Academic coursework and projects.
* Part-time or summer employment.
* Internships and co-op experiences.
* Student organizations and leadership roles.
* Volunteer work and community involvement.
* Technical skills and certifications.
* Research projects and academic achievements.

Key Guidelines:
* Generate complete, professional cover letters without asking for additional input.
* **Crucially, the primary output cover letter MUST NOT contain any bracketed placeholders (e.g., \`[Your Name]\`, \`[Company Name]\`) that require direct user editing within the letter itself.**
* **When essential personal details (e.g., applicant's name, address, phone, email) are not provided, use generic but appropriately formatted defaults (e.g., 'Applicant Name', 'Applicant Address Line 1', 'City, State Zip Code', 'applicant.email@example.com', '555-555-5555', 'Current Date') in the main letter output. Then, in the 'Suggestions for Enhancement' section, explicitly instruct the user to replace these generic placeholders with their specific information.**
* **When recipient details (e.g., specific Hiring Manager name, Company Address) are not provided in the job description, use standard defaults (e.g., 'Hiring Manager', 'Company Name', 'Company Address') in the main letter output. If applicable, suggest in the 'Suggestions for Enhancement' section that providing a specific name/address would personalize the letter.**
* Make reasonable assumptions about typical college student backgrounds when resume is not provided.
* When resume is provided, prioritize specific details from the resume over generic assumptions.
* The model should implement any improvements it can make autonomously (e.g., rephrasing, structural adjustments, better word choice) without explicit suggestion to the user.
* Focus on deliverable output rather than coaching or explanation.

Response Format:
Primary Output: Complete cover letter ready for submission.
Additional Feedback (if applicable): If the generated cover letter would benefit from *additional student information or experiences that the model cannot infer or generate itself*, or if *essential personal/recipient details were generically filled and need user input*, provide specific suggestions at the end of your response in a separate "Suggestions for Enhancement" section.
Example Suggestions Format:
If additional information would strengthen the cover letter, conclude your response with:
Suggestions for Enhancement:
* Specific experiences or skills that would strengthen the application.
* Additional background information that could be highlighted.
* Particular achievements or projects that would be relevant to mention.
* **Please replace 'Applicant Name', 'Applicant Address Line 1', 'City, State Zip Code', 'applicant.email@example.com', '555-555-5555', and 'Current Date' with your actual details before submission.**
* **Consider researching the specific hiring manager's name and company address to personalize the salutation and contact information.**
`;

export const DATASET = [
  {
    job_description:
      'Job Title: Associate\nCompany: LEK Consulting\nLocation: Palo Alto, CA\n\nLEK Consulting is seeking highly motivated and analytical individuals for an Associate position. The ideal candidate will possess strong quantitative and problem-solving skills, demonstrate leadership potential, and have an entrepreneurial mindset. Responsibilities include conducting in-depth research, analyzing complex data, developing strategic recommendations, and presenting findings to clients. Experience in technical fields, project management, and collaborative teamwork is highly valued.',
    resume_info: {
      education: [
        { degree: 'Master of Science', major: 'Mechanical Engineering', institution: 'Stanford University', status: 'expected June 20XX' },
      ],
      coursework: ['Technical courses', 'Computer Science', 'Economics'],
      work_experience: [
        {
          title: 'Summer Intern',
          company: 'General Motors',
          description:
            'Developed analytical skills by taking measurements on a development vehicle, identifying design problems, offering solutions for improvement, and making recommendations in a written report. Awarded a General Motors scholarship for exceptional contributions as a member of the S-10 Crew Cab launch team.',
        },
      ],
      leadership_roles: [
        {
          role: 'Elected President',
          organization: 'Service Organization',
          description:
            'Led an organization with over one hundred active members, honing decision-making, planning, organizing time, teamwork, interpersonal, oral, and written communication skills.',
        },
      ],
      projects: [
        {
          name: 'Product Design, Patenting, and Marketing',
          description: 'Designed, patented, and marketed own product, demonstrating entrepreneurial spirit and creativity.',
        },
      ],
      technical_skills: [],
      soft_skills: [
        'Analytical',
        'Quantitative',
        'Decision-making',
        'Planning',
        'Organizing time',
        'Teamwork',
        'Interpersonal communication',
        'Oral communication',
        'Written communication',
        'Entrepreneurial spirit',
        'Creativity',
        'Problem-solving',
      ],
      awards_achievements: ['General Motors scholarship'],
    },
    expected_cover_letter:
      "P.O. Box 000033\nStanford, CA 94000\nOctober 19, 20XX\n\nMs. Marian Armstone\nHuman Resources Manager\nLEK Consulting\n9999 Oak Street\nPalo Alto, CA 9003\n\nDear Ms. Armstone:\n\nThis letter and the attached resume serve as my application for the Associate position at LEK Consulting. After speaking with Jo Kimmer at Stanford's Career Fair on October 9, I believe my skills, academic training, and work experience are a good fit for this position.\n\nI will complete a Master of Science degree in Mechanical Engineering in June 20XX. I have developed strong analytical and quantitative skills through coursework in technical, computer science, and economics courses. In addition, my hands-on experience in various internships and student leadership positions supports my qualifications as an Associate.\n\nAs an intern at General Motors this past summer, I developed analytical skills by taking measurements on a development vehicle identifying design problems, offering solutions for improvement, and making recommendations in a written report. I was awarded a General Motors scholarship for my exceptional contributions as a member of the S-10 Crew Cab launch team.\n\nAt Stanford, I demonstrated leadership ability by serving as the elected president for a service organization with over one hundred active members. In this effort, I honed my ability to make good decisions, plan and organize my time, work well on a team, and have developed sound interpersonal, oral, and written communications skills. Finally, I bring an entrepreneurial spirit and creativity to this position, as evidenced by my experience designing, patenting, and marketing my own product.\n\nI would enjoy speaking with you further to discuss, in detail, how I am a match for the Associate position. I will follow up in two weeks to see if there is additional information you would like me to provide or answer questions you may have (another option: I am eager to apply my energy, experience, and enthusiasm to the work of LEK and look forward to hearing from you soon.).\n\nSincerely,\n\nJohn Duncan\n\nJohn Duncan",
    suggestions_for_enhancement: null,
  },
  {
    job_description:
      'Job Title: Summer Intern\nCompany: Jonson Inc.\nLocation: New York, NY\n\nJonson Inc. is seeking a Summer Intern with a passion for fashion and strong communication skills. The ideal candidate will assist with various tasks including fashion journalism, event planning, and general marketing support. Attention to detail, organizational skills, and a proactive approach are essential. Experience in writing, editing, and project coordination is a plus.',
    resume_info: {
      education: [
        { degree: 'Junior', major: 'Communication and International Relations', institution: 'Stanford University', status: 'current' },
      ],
      coursework: [],
      work_experience: [
        {
          title: 'Writer',
          company: 'One Line to You (online magazine)',
          description:
            'Gained experience in fashion journalism, parlaying depth of knowledge into written pieces about various aspects of the fashion world, furthering education of the industry.',
        },
        {
          title: 'Marketing Intern',
          company: 'San Francisco Symphony',
          description:
            'Prepared for responsibilities by writing newsletters, researching artists for performance programs, assisting with event planning, running errands, composing press releases, and editing/proof-reading written material. Learned importance of thoroughness, attention to detail, and organization in a fast-paced environment.',
        },
      ],
      leadership_roles: [],
      projects: [],
      technical_skills: [],
      soft_skills: [
        'Fashion journalism',
        'Event planning',
        'Writing',
        'Editing',
        'Proofreading',
        'Attention to detail',
        'Organization',
        'Communication',
        'Fast-paced environment adaptation',
      ],
      interests: ['Fashion', 'Art', 'Consumer industry', 'Creative advertising', 'Photography'],
    },
    expected_cover_letter:
      "Andrea Abre\n12345 First Street | Palo Alto, CA 94305 | 650.555.1234 | andreaabre@stanford.edu\n\nJonson Inc.\n123 Fifth Avenue\nNew York, NY 10019\n\nDear Hiring Manager:\n\nI am writing to apply for your summer intern position posted on Jonsoninc.com. I have experience in fashion journalism through my work with the online magazine One Line to You and have a background in event planning through my work as a Marketing Intern this past summer. Currently, I am a junior at Stanford University studying Communication and International Relations and I plan to pursue a career in fashion upon graduation. Jonson would be a great springboard in achieving that goal.\n\nMy passion for fashion and art comes from my grandmother who was a fabric designer in New York during the 1940s and 50s. From her, I learned a great deal about color and design. Since the age of 10, I have been consumed by the industry and have studied Vogue, Harper's Bazaar and Elle magazines. In addition, I analyze and examine the work of designers and follow fashion critics like Suzy Menkes. After beginning to write for the online magazine, One Line to You, I had the opportunity to parlay my depth of knowledge into written pieces about various aspects of the fashion world. My expression through this medium also allowed me to further my education of the industry.\n\nI believe the marketing internship at the San Francisco Symphony best prepared me for the responsibilities of an intern at Jonson. In this position I was trusted with a great deal of responsibility. I wrote newsletters, researched artists to compile performance programs, helped with event planning, ran errands, composed press releases and edited and proof-read written material. Through these tasks I learned the importance of being thorough while working in a fast-paced environment. My attention to detail and organization allowed me to thrive in this context and they will do the same at Jonson.\n\nAfter reviewing Jonson's spring ready-to-wear collection, I feel it would be amazing to work toward the new creative director Heather London's vision. It must be a very exciting time for the Jonson label.\n\nI look forward to hearing from you in the near future and am available for an interview at your convenience. Please contact me with any questions you may have. Thank you for your time and consideration.\n\nSincerely.\n\nAndrea Abre\n\nAndrea Abre",
    suggestions_for_enhancement: null,
  },
  {
    job_description:
      "Job Title: Consulting Position\nCompany: Navigant's Emerging Technology & Business Strategy group\n\nNavigant is seeking a Consulting professional for its Emerging Technology & Business Strategy group. The ideal candidate will possess a strong understanding of the energy sector, exceptional data analysis capabilities, and polished communication skills. Prior consulting experience is highly valued. We are looking for individuals who embody excellence, are committed to continuous development, demonstrate an entrepreneurial spirit, and uphold integrity in all their work.",
    resume_info: {
      education: [{ degree: "Master's student (second year)", program: 'Technology and Policy Program (TPP)', institution: 'MIT' }],
      coursework: ['Data science', 'Energy economics', 'Energy ventures and strategy', 'Technology policy'],
      work_experience: [
        {
          title: 'Research Assistant',
          company: 'MIT Energy Initiative',
          description:
            'Used statistical analysis to investigate trends in public acceptance and regulation related to emerging energy technologies.',
        },
        {
          title: 'Science Writer and Policy Analyst',
          company: 'LMN Research Group',
          duration: 'Consulting (first of four years)',
          description:
            'Developed superb technical writing and visual communication skills, and an ability to communicate and collaborate with clients at federal agencies such as EPA and DOE.',
        },
        {
          title: 'Research Analyst',
          company: 'XYZ Consulting',
          duration: 'Consulting (after LMN Research Group)',
          description: 'Developed an in-depth understanding of data analysis, program evaluation, and policy design.',
        },
      ],
      leadership_roles: [
        { role: 'Student Leader', organization: "MIT Energy Conference's Technology Commercialization round-table" },
        { role: 'Mentorship Manager', organization: 'MIT Clean Energy Prize' },
      ],
      projects: [],
      technical_skills: [
        'Statistical analysis',
        'Data analysis',
        'Technical writing',
        'Visual communication',
        'Program evaluation',
        'Policy design',
      ],
      soft_skills: [
        'Communication',
        'Critical thinking',
        'Analysis',
        'Leadership',
        'Client collaboration',
        'Entrepreneurial spirit',
        'Integrity',
      ],
      awards_achievements: [],
    },
    expected_cover_letter:
      "I am a second year master's student in MIT's Technology and Policy Program (TPP) writing to apply for a consulting position in Navigant's Emerging Technology & Business Strategy group. After speaking with John Smith at the MIT career fair, I realized that Navigant's values of excellence, continuous development, entrepreneurial spirit, and integrity align with the principles that guide me every day and that have driven me throughout my career. Moreover, I believe that my knowledge of the energy sector, passion for data analysis, polished communication skills, and four years of consulting experience will enable me to deliver superior value for Navigant's clients.\n\nAs a graduate student in MIT's Technology and Policy Program, I spend every day at the cutting edge of the energy sector. In my capacity as an MIT Energy Initiative research assistant, I use statistical analysis to investigate trends in public acceptance and regulation related to emerging energy technologies. Graduate classes in data science, energy economics, energy ventures and strategy, and technology policy have prepared me to help Navigant offer the expert services that set it apart from competitors. Furthermore, I will bring Navigant the same leadership skills that I used as the student leader for the MIT Energy Conference's Technology Commercialization round-table, and as the mentorship manager for the MIT Clean Energy Prize.\n\nEven before MIT, my four years of work experience in consulting-first at LMN Research Group and then at XYZ Consulting-allowed me to develop the skillset that Navigant looks for in candidates. As a science writer and policy analyst at LMN Research Group, I developed superb technical writing and visual communication skills, as well as an ability to communicate and collaborate with clients at federal agencies such as EPA and DOE. As a research analyst at XYZ Consulting, I developed an in-depth understanding of data analysis, program evaluation, and policy design.\n\nI take pride in my skills and experience in several domains: critical thinking and analysis, communication, and leadership. I note that Navigant values these same ideals, and I very much hope to use my abilities in service of the firm and its clients. Thank you for your time and consideration, I look forward to speaking with you further about my qualifications.",
    suggestions_for_enhancement: null,
  },
  {
    job_description:
      'Job Title: Assistant Professor of Musicology\nCompany: University of Washington School of Music\n\nThe University of Washington School of Music invites applications for a tenure-track Assistant Professor of Musicology. We seek a scholar with a strong research agenda in historical musicology, demonstrated interdisciplinary engagement, and a commitment to excellent teaching at both undergraduate and graduate levels. Candidates should be prepared to design and deliver innovative courses, mentor students, and contribute to the academic community. Engagement in public service and working with diverse populations is highly valued.',
    resume_info: {
      education: [
        {
          degree: 'Ph.D.',
          major: 'Historical Musicology',
          institution: 'Harvard University',
          advisor: 'Dieter Fischer',
          status: 'expected May 2019',
        },
      ],
      research: [
        {
          title: 'The American Mahler: Musical Modernism and Transatlantic Networks, 1920-1960 (Dissertation)',
          description:
            "Interdisciplinary research uniting American musical modernism and transmission/reception of music in interpersonal networks. Draws from historical musicology, oral history, sociology, American studies, and Jewish studies. Examines Mahler's music relationship with Nadia Boulanger, Aaron Copland, Serge Koussevitzky, and Leonard Bernstein.",
        },
        {
          title: 'Future Research Project',
          description:
            'Interrogating assumptions about art music as a written tradition by examining abridgment of orchestral works in 20th-century US. Compares performing scores, marked orchestral part books, and concert reviews. Published research on Chant transmission.',
        },
      ],
      teaching_experience: [
        {
          level: 'Secondary and Higher Education',
          description:
            'Several years of experience. Designed and executed a yearlong course for graduate students on teaching methods. Conducted video-based consultations on classrooms. Advised faculty members on syllabi.',
        },
        {
          course: 'Intensive survey of Western music history',
          level: 'Graduate students',
          institution: 'University of Massachusetts Amherst',
          description: 'Selected to lead this course.',
        },
        { course: 'Chinese civilization', level: 'Undergraduate (sections)', institution: 'Harvard University' },
        { course: 'Chinese film, literature, and culture', level: 'Undergraduate', institution: 'Harvard University' },
      ],
      public_service: [
        {
          name: 'Harvard Mobile Music Lab (Co-founder)',
          description:
            'Applied for and received grant funds to establish. Teaches various subjects through music to a diverse classroom of fourth graders in Boston.',
        },
        {
          role: 'Teach For America corps member',
          description: 'Recognized for teaching math through music to economically disadvantaged children.',
        },
      ],
      technical_skills: [],
      soft_skills: [
        'Research',
        'Writing',
        'Teaching',
        'Mentoring',
        'Curriculum design',
        'Interdisciplinary thinking',
        'Public service',
        'Working with diverse populations',
        'Engaging writing',
        'Confidence',
      ],
      awards_achievements: [],
    },
    expected_cover_letter:
      "HARVARD UNIVERSITY\nDEPARTMENT OF MUSIC\nMUSIC BUILDING\nCAMBRIDGE, MASSACHUSETTS 02138, USA\n617-495-2791\nJanuary 14, 2018\n\nProfessor Rosalie Cork\nSearch Committee Chair - 51674\nSchool of Music\n1017 N. Pemagasset Road\nSeattle, WA 98195-1234\n\nDear Professor Cork and Members of the Search Committee:\n\nI write to apply for the position of Assistant Professor of Musicology in the University of Washington School of Music. Under the direction of Dieter Fischer, I am completing my Ph.D. in historical musicology at Harvard University with an expected degree date of May 2019.\n\nMy interdisciplinary research unites two strands of recent, significant musicological inquiry: the development of American musical modernism as a transatlantic phenomenon, and the transmission, reception, and circulation of music in interpersonal networks. In my dissertation, \"The American Mahler: Musical Modernism and Transatlantic Networks, 1920-1960,\" I argue that the growth of Mahler's reputation shaped musical modernism in the United States. I draw from historical musicology, oral history, sociology, American studies, and Jewish studies to examine the relationship between Mahler's music and an intimate network of four influential figures in American modernism: Nadia Boulanger, Aaron Copland, Serge Koussevitzky, and Leonard Bernstein. Boulanger's score collection shows that she encountered Mahler's music in Amsterdam in 1920 and taught his music to her American students, including Copland. On his return to the United States, Copland drew on his engagement with Mahler's music to construct his own identity as an American modernist. Copland also encouraged Koussevitzky and Bernstein to promote Mahler; Koussevitzky enlisted Mahler's music to reinforce his own advocacy of modernism in the concert hall, while Bernstein did so to bolster the stature of modern tonal composition. The discovery of these figures' shared relationships with Mahler's music reveals that their articulations of Mahler's significance were deeply bound to their priorities as members of a transatlantic modernist community.\n\nMy next major research project will make use of the University of Washington's archival holdings to interrogate long-held assumptions about art music as a written tradition by examining a practice that most onlookers today reject as sacrilegious but that was once quite common: the abridgment of orchestral works in performance, by conductors, in the United States in the first half of the 20th century. In the course of my dissertation research, I discovered performing scores, as well as marked orchestral part books and concert reviews, that document this practice. A comparison of these sources illuminates a written record of the transmission of such changes among performers and across generations. Scholars usually approach symphonic works as permanently fixed entities, but my own published research on Chant transmission has prompted me to treat abridgment as evidence that performers and audiences have negotiated symphonic music through complex patterns and channels of oral and aural transmission. I look forward to enriching my perspective on American musical culture during this period by exploring the papers of Helen Hopekirk and of the Club Filarmónico Tucsonense.\n\nMy teaching, like my research, reflects a passionate interest in the specific circumstances in which musicians and audiences interact with music. My primary goal as a music educator-fueled by several years of experience teaching at the secondary level and in higher education is to harness the powerful relationships that students already have with music in general, bridging the gap between those relationships and the music they encounter in academic settings. In exploring the melodic aesthetics of mass songs in the 20th century for a course on American musical theatre, I had students compare the experience of attempting to sing Marc Blitzstein's song \"The Cradle Will Rock\" with \"7 $1/2$ Cents\" from the Richard Adler and Jerry Ross musical The Pajama Game. To approach a rhythmically complex passage from the scherzo of Beethoven's Ninth Symphony in a general education course on music appreciation, I led the class in conducting it from a recording; I also had students collaborate to create play-by-play podcasts of portions of the work in the style of sports commentary. Through such activities, I transform music history from an abstract phenomenon into a tangible part of students' lives, generating entry points for discussions of how musicians and audiences in the past grappled with music.\n\nMy research and my recent teaching experience-which has included designing and executing a yearlong course for other graduate students on teaching methods, conducting video-based consultations on their classrooms, and advising faculty members on their syllabi have primed me to create and teach inspiring music courses. I was selected to lead an intensive survey of Western music history for graduate students at the University of Massachusetts Amherst this spring. I am also prepared to lead classes on a wide array of subjects in art and vernacular musics, from medieval to 21st-century music, including surveys, for students with varying levels of musical knowledge and experience. I would enjoy planning courses that cover a variety of areas, including transmission and reception, modernism as transnational phenomenon, the intersections between Western art music and vernacular traditions, and the shifting relationships between musical institutions and their cultural contexts.\n\nAs a lifelong teacher who is committed to public service and working with members of diverse populations, I would look forward to serving the University of Washington community. Along with a colleague at Harvard, I applied for and received grant funds to establish the Harvard Mobile Music Lab, in which we teach various subjects through music to a diverse classroom of fourth graders in Boston. As a former Teach For America corps member who was recognized for teaching math through music to economically disadvantaged children, I would relish the opportunity to work with colleagues and students to inspire the next generation of musicians and scholars in Seattle and beyond.\n\nThank you for your consideration. I look forward to hearing from you.\n\nSincerely,\n\nVidita Chatterjee\nvchatterjee@xxx.harvard.edu, (617) 000-0123",
    suggestions_for_enhancement: null,
  },
  {
    job_description:
      'Job Title: Junior or Assistant Copywriter (Networking Inquiry)\nCompany: Putnam, Blair and Associates (Advertising Agency)\n\nThis is a networking inquiry for individuals interested in Junior or Assistant Copywriter positions within the advertising industry. We seek individuals with strong writing and communication skills, a passion for advertising, and a proactive approach to career development. Experience in marketing or related fields is beneficial. The purpose of this inquiry is to gain industry insights and identify potential future employment opportunities.',
    resume_info: {
      education: [{ degree: 'B.A.', major: 'English', institution: 'Stanford University', status: 'expected June' }],
      coursework: [],
      work_experience: [
        { title: 'Summer Internship', department: 'Marketing Department', company: 'Small high-tech company' },
        { title: 'Advertising Manager', company: 'Stanford Daily' },
      ],
      leadership_roles: [],
      projects: [],
      technical_skills: [],
      soft_skills: ['Writing', 'Communication', 'Time management', 'Determination'],
      interests: ['Advertising', 'Photography', 'Consumer market', 'Creative side of advertising'],
    },
    expected_cover_letter:
      "P.O. Box 12345\nStanford, CA 94309\n650-999-1212\nFebruary 10, 20XX\n\nMs. Laura Valencia\nManager\nCreative Services Department\nPutnam, Blair and Associates\n12 Front Street\nSan Francisco, CA 94108\n\nDear Ms. Valencia:\n\nThis June, I will graduate with a B.A. degree in English from Stanford University. I have a strong interest in advertising and will soon seek a position as a Junior or Assistant Copywriter. Robert Blum encouraged me to contact you, suggesting that you might be willing to meet with me and provide an insider's view of how I can best identify employment opportunities in this field.\n\nIt may be helpful for you to know that I completed a summer internship in the Marketing Department of a small high-tech company and have worked as the Advertising Manager at the Stanford Daily. I believe that both experiences are relevant to future work in advertising. I have strong writing and communication skills and enjoy working in a fast-paced environment. In addition, working throughout my Stanford career to finance a substantial portion of my education has strengthened my time management skills and determination to pursue and achieve my goals. These skills, together with my passion for photography, fascination with the consumer market, and personal interest in the creative side of advertising lead to my strong interest in this field.\n\nI will be in touch with you by phone this week. At your convenience, I would like to set up a short 20-30 minute meeting with you at your worksite. Any advice or suggestions for my job search are welcomed.\n\nI understand you are busy, and I appreciate your time.\n\nSincerely,\nAmy Chen\n\nAmy Chen",
    suggestions_for_enhancement:
      'If applying for a formal job posting, provide more detail on specific campaigns or projects from the Stanford Daily or the marketing internship where you demonstrated creative copywriting or measurable impact.',
  },
  {
    job_description:
      "Job Title: Postdoctoral Position (Immunology)\nCompany: Laboratory of Dr. Keshilian, University of California at San Diego (UCSD)\n\nDr. Keshilian's laboratory at UCSD is seeking a postdoctoral researcher in Immunology. The lab focuses on innate immune responses to viral infections, with particular interest in autophagy, RLRs, and NLRs. Candidates should have a strong research background in immunology, especially in T cell responses to viral infection and apoptosis. Experience with in vitro and in vivo models is highly desirable.",
    resume_info: {
      education: [
        {
          degree: 'Ph.D.',
          major: 'Immunology',
          institution: 'Harvard University',
          advisor: 'Martin Rothberg',
          status: 'expected May 2019',
        },
      ],
      research: [
        {
          title: 'Defining the role of IL-21 in CD8+ T cell responses to viral antigens (Dissertation Research)',
          description:
            "Demonstrated that IL-21 can induce Bcl-2-mediated apoptosis of memory CD8+ T cells specific for an SIV antigen using an in vitro system. Demonstrated IL-21's crucial role in the development of primary and secondary responses to virally encoded antigens in IL-21Ra-deficient mice, indicating IL-21 directly stimulates CD8+ T cell proliferation and survival. Published work in The Journal of Immunology, with a manuscript describing in vivo results anticipated soon.",
        },
        { interest: 'Innate immune responses to viral infections', specific_areas: ['Autophagy', 'RLRs', 'NLRs'] },
      ],
      technical_skills: ['In vitro systems', 'In vivo models', 'Immunology research', 'Scientific writing', 'Data analysis'],
      soft_skills: ['Research', 'Problem-solving', 'Communication'],
      awards_achievements: [],
    },
    expected_cover_letter:
      "Dear Dr. Keshilian -\n\nMy Ph.D. advisor, Martin Rothberg of Harvard Medical School, suggested I write to you to inquire about the possibility of a postdoctoral position in your laboratory. I am currently completing my Ph.D. in Immunology at Harvard, and expect to defend by May, 2019.\n\nI am interested in immune responses to viral infection, and my research with Dr. Rothberg has concentrated upon defining the role of IL-21 in the development of CD8+ T cell responses to viral antigens. Using an in vitro system, we have demonstrated that IL-21 can induce Bcl-2-mediated apoptosis of memory CD8+ T cells specific for an SIV antigen. We have also demonstrated that IL-21 plays a crucial role in the development of primary and secondary responses to virally encoded antigens in IL-21Ra-deficient mice. This study has indicated that IL-21 directly stimulates CD8+ T cell proliferation and survival. Our in vitro work has been published in The Journal of Immunology and we anticipate submitting a manuscript describing our in vivo results soon. This work is described in more detail in my accompanying CV.\n\nI hope to complement my understanding of the CD8+ T cell response to viral infection and CD8+ T cell apoptosis with postdoctoral training that furthers my understanding of innate immune responses to viral infections. I have followed your lab's work in this area and am particularly interested in your work on autophagy, RLRs, and NLRs in viral infection. I would be very interested in working with you for my postdoctoral training to further my understanding of innate immune responses to viruses.\n\nIf you anticipate a position becoming available, I would greatly appreciate an opportunity to further discuss my research interests with you. I will be attending the upcoming Gordon Conference on Immunochemistry & Immunobiology in La Jolla, and I would be available to meet with you there or at UCSD that week.\n\nSincerely,\n\nMelanie Porter",
    suggestions_for_enhancement:
      "If applying for a formal job posting, provide more detail on specific methodologies used in your research and how they directly align with the lab's techniques. Quantify research outcomes where possible (e.g., 'reduced apoptosis by X%').",
  },
];
