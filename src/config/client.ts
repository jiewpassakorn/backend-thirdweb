import { createThirdwebClient } from 'thirdweb';

export const CLIENT = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string
});
