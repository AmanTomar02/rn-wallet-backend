// import ratelimit from "../config/upstash.js";

// const ratelimiter = async (req, res, next) => {
//   try {
//     const { success } = await ratelimit.limit("my-rate-limit");

//     if (!success) {
//       return res
//         .status(429)
//         .json({ message: "Too many request, please try again later" });
//     }

//     next();
//   } catch (error) {
//     console.log("Rate Limit Error : ", error);
//     next(error);
//   }
// };

// export default ratelimiter;


const ratelimiter = async (req, res, next) => {
  try {
    next(); // bypass for now
  } catch (error) {
    console.log("Rate limit disabled:", error.message);
    next();
  }
};

export default ratelimiter;
