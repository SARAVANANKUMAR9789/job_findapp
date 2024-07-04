import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModels.js";
import Users from "../models/userModel.js";

export const jobApply = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
  } = req.body;
  let { id } = req.params;
  try {
    if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
      next("Please provide all required fields");
    }

    const userId = req.body.user.userId;
    await addApplicationToUser(req.body, userId, id);
    await addApplicationToJobs(userId, id);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addApplicationToUser = async (user, userId, jobId) => {
  let result = {
    ...user,
  };
  if (user?.jobApplications?.length) {
    result["jobApplications"].push(jobId);
  } else {
    result["jobApplications"] = [jobId];
  }
  const userData = await Users.findByIdAndUpdate(userId, result, {
    new: true,
  });
};

export const addApplicationToJobs = async (userId, jobId) => {
  let job = await Jobs.findOne({ _id: jobId });
  console.log(job, "job");
  
  if (!job?.application?.includes(userId)) {
    job.application.push(userId);
  } else {
    job.application.push(userId)= [userId];
  }
  console.log(job, "result");
  const jobData = await Jobs.findByIdAndUpdate(jobId, job, {
    new: true,
  });
  console.log(jobData, "jobData");
};

export const getApply = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await Users.findById({ _id: id });
    if (!user) {
      return res.status(404).send({
        message: "User Not Found",
        success: false,
      });
    }
    const result = await Promise.all(
      user.jobApplications.map(async (job) => {
        return await Jobs.findById(job.toString()).populate({
          path: "company",
          select: "-password",
        })
      })
    );

    res.status(200).json({
      success: true,
      data:result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getApplycompanydetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    const company = await Companies.findById(id);
    console.log(id);

    if (!company) {
      return res.status(404).send({
        message: "Company Not Found",
        success: false,
      });
    }

    const jobResults = await Promise.all(
      company.jobPosts.map(async (jobId) => {
        return await Jobs.findById(jobId.toString());
      })
    );

    const users = await Promise.all(
      jobResults
        .filter(jobs => jobs !== null && jobs !== undefined)
        .flatMap(jobs => jobs.application) 
        .map(async (userId) => {
          return await Users.findById(userId.toString());
        })
    );
    console.log(jobResults);
    console.log(users);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

