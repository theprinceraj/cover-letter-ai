import { useState } from "react";

// export interface UseAuthReturn {
//     userId: string | null;
//     isGuest: boolean;
//     handleGuestLogin: () => void;
// }

export const useAuth = () => {
  const [userId, setUserId] = useState<String | null>(null);
  const [guest, isGuest] = useState<boolean>(false);
};
