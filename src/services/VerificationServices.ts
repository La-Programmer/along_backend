import Redis from "ioredis";

const redisClient = new Redis({
  host: "localhost", // Change to your Redis host if needed
  port: 6379,        // Default Redis port
});

// Function to generate and store OTP in Redis
export async function storeOtp(email: string, otp: string): Promise<void> {
  const expiresIn = 10 * 60; // 10 minutes in seconds

  // Store OTP in Redis with expiration
  await redisClient.setex(`otp:${email}`, expiresIn, otp);
}

// Function to verify the OTP
export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp) {
    throw new Error("OTP has expired or does not exist");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  // OTP is valid, remove it from Redis
  await redisClient.del(`otp:${email}`);
  return true;
}

