import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { FiEdit3, FiPhoneCall, FiUpload, FiPaperclip } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CustomButton, JobCard, Loading, TextInput } from "../components";
import { Login } from "../redux/userSlice";
import { apiRequest, handleFileUpload } from "../utils/index";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const JobApplydetails = ({ ApplyForm, setApplyForm }) => {
  const { user } = useSelector((state) => state.user);

  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);

  const getRecentPost = async () => {
    setIsFetching(true);
    try {
      const id = user?._id;

      const res = await apiRequest({
        url: "/users/get-apply-companydetails/" + id,
        method: "GET",
      });

      setData(res?.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecentPost();
  }, []);
  const closeModal = () => setApplyForm(false);
  return (
    <>
      <Transition appear show={ApplyForm ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-600"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Job Apply Detail
                  </Dialog.Title>
                  <div className="w-full flex flex-col space-y-6">
                    {data?.map((cmp, index) => (
                      <div key={index} className="w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded">
                        <div className="w-3/4 md:w-2/4 flex gap-4 items-center">
                          <div>
                            <img
                              src={cmp?.profileUrl || noLogo}
                              alt={cmp?.name}
                              className="w-8 md:w-12 h-8 md:h-12 rounded"
                            />
                          </div>
                          <div className="h-full flex flex-col">
                            <div
                              className="text-base md:text-lg font-semibold text-gray-600 truncate"
                            >
                              {cmp?.firstName} {cmp?.lastName}
                            </div>
                            <span className="text-sm text-blue-600">
                              {cmp?.email}
                            </span>
                          </div>
                          <span className="text-xl md:base font-normal text-gray-600">
                          contact:
                          </span>
                          <div
                              className="text-xl md:text-lg font-semibold text-gray-600 truncate"
                            >
                              {cmp?.contact}
                            </div>
                        </div>

                        <div className="hidden w-1/4 h-full md:flex items-center">
                        <span className="text-xl md:base font-normal text-gray-600">
                        location:    
                          </span>
                          <p className="text-base text-start">
                            {cmp?.location}
                          </p>
                        </div>

                        <div className="w-1/4 h-full flex flex-col items-center">
                          <p className="text-blue-600 font-semibold">
                            {cmp?.jobTitle}
                          </p>
                          <span className="text-base md:base font-normal text-gray-600">
                            Jobs Posted
                          </span>
                        </div>
                      </div>
                    ))}

                    {isFetching && (
                      <div className="mt-10">
                        <Loading />
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const CompnayForm = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [uploadCv, setUploadCv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState({ staus: false, message: "" });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrMsg(null);

    const uri = profileImage && (await handleFileUpload(profileImage));

    const newData = uri ? { ...data, profileUrl: uri } : data;

    try {
      const res = await apiRequest({
        url: "/companies/update-company",
        token: user?.token,
        data: newData,
        method: "PUT",
      });
      setIsLoading(false);
      if (res.status === "failed") {
        setErrMsg({ ...res });
      } else {
        setErrMsg({ status: "success", message: res.message });
        const newData = { token: res?.token, ...res?.user };
        dispatch(Login(newData));
        localStorage.setItem("userInfo", JSON.stringify(data));

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Edit Company Profile
                  </Dialog.Title>

                  <form
                    className="w-full mt-2 flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="name"
                      label="Company Name"
                      type="text"
                      register={register("name", {
                        required: "Compnay Name is required",
                      })}
                      error={errors.name ? errors.name?.message : ""}
                    />

                    <TextInput
                      name="location"
                      label="Location/Address"
                      placeholder="eg. Califonia"
                      type="text"
                      register={register("location", {
                        required: "Address is required",
                      })}
                      error={errors.location ? errors.location?.message : ""}
                    />

                    <div className="w-full flex gap-2">
                      <div className="w-1/2">
                        <TextInput
                          name="contact"
                          label="Contact"
                          placeholder="Phone Number"
                          type="text"
                          register={register("contact", {
                            required: "Contact is required!",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div className="w-1/2 mt-2">
                        <label className="text-gray-600 text-sm mb-1">
                          Company Logo
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-gray-600 text-sm mb-1">
                        About Company
                      </label>
                      <textarea
                        className="ounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                        rows={4}
                        cols={6}
                        {...register("about", {
                          required: "Write a little bit about your company.",
                        })}
                        aria-invalid={errors.about ? "true" : "false"}
                      ></textarea>
                      {errors.about && (
                        <span
                          role="alert"
                          className="text-xs text-red-500 mt-0.5"
                        >
                          {errors.about?.message}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <CustomButton
                          type="submit"
                          containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none "
                          title={"Submit"}
                        />
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const CompanyProfile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [ApplyForm, setApplyForm] = useState(false);

  const fetchCompany = async () => {
    setIsLoading(true);
    let id = null;

    if (params.id && params.id !== undefined) {
      id = params?.id;
    } else {
      id = user?._id;
    }

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-5">
      <div className="">
        <div className="w-full flex flex-col md:flex-row gap-3 justify-between">
          <h2 className="text-gray-600 text-xl font-semibold">
            Welcome, {info?.name}
          </h2>

          {user?.user?.accountType === undefined && info?._id === user?._id && (
            <div className="flex items-center justifu-center py-5 md:py-0 gap-4">
              <CustomButton
                onClick={() => setOpenForm(true)}
                iconRight={<FiEdit3 />}
                containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600  hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
              />

              <Link to="/upload-job">
                <CustomButton
                  title="Upload Job"
                  iconRight={<FiUpload />}
                  containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none  rounded text-sm md:text-base border border-blue-600`}
                />
              </Link>
              <button
                className="w-full md:w-64 bg-blue-600 text-white  py-2 rounded"
                onClick={() => setApplyForm(true)}
              >
                Job Apply Details
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-sm">
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <HiLocationMarker /> {info?.location ?? "No Location"}
          </p>
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <AiOutlineMail /> {info?.email ?? "No Email"}
          </p>
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <FiPhoneCall /> {info?.contact ?? "No Contact"}
          </p>

          <div className="flex flex-col items-center mt-10 md:mt-0">
            <span className="text-xl">{info?.jobPosts?.length}</span>
            <p className="text-blue-600 ">Job Post</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-20 flex flex-col gap-2">
        <p>Jobs Posted</p>

        <div className="flex flex-wrap gap-3">
          {info?.jobPosts?.map((job, index) => {
            const data = {
              name: info?.name,
              email: info?.email,
              logo: info?.profileUrl,
              ...job,
            };
            return <JobCard job={data} key={index} />;
          })}
        </div>
      </div>

      <CompnayForm open={openForm} setOpen={setOpenForm} />
      <JobApplydetails ApplyForm={ApplyForm} setApplyForm={setApplyForm} />
    </div>
  );
};

export default CompanyProfile;
