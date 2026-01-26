import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitkey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitkey);
    if (rateLimit) {
        res.status(429).json({ message: "Too may requests. Please wait before requesting new op" });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300
    });
    await redisClient.set(rateLimitkey, 'true', {
        EX: 60
    });
    const message = {
        to: email,
        subject: "Your otp code",
        body: `Your OTP is ${otp} it is valit for 5 minutes`
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({ message: "OTP sent to your mail" });
});
//# sourceMappingURL=user.js.map