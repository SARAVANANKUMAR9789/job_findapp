import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CompanyCard,
  CustomButton,
  Header,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateURL } from "../utils";
import { useSelector } from "react-redux";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const Applications = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const { user } = useSelector((state) => state.user);

  const getRecentPost = async () => {
    setIsFetching(true);
    try {
      const id = user?._id;

      const res = await apiRequest({
        url: "/users/get-apply/" + id,
        method: "GET",
      });

      setData(res?.data);
      console.log(res);
      console.log(id);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecentPost();
  }, []);

  return (
    <div className='w-full'>
      <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5  py-6 bg-[#f7fdfd]'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm md:text-base'>
            Shwoing: <span className='font-semibold'>{recordsCount}</span>{" "}
            Companies Available
          </p>

          <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
            <p className='text-sm md:text-base'>Sort By:</p>

            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className='w-full flex flex-col gap-6'>
          {data?.map((cmp, index) => (
            <div key={index}  className='w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded'>
            <div className='w-3/4 md:w-2/4 flex gap-4 items-center'>
                <img
                  src={cmp?.company?.profileUrl || noLogo}
                  alt={cmp?.company?.name}
                  className='w-8 md:w-12 h-8 md:h-12 rounded'
                />
                
              <div className='h-full flex flex-col'>
                <div
                  className='text-base md:text-lg font-semibold text-gray-600 truncate'
                >
                  {cmp?.jobTitle}
                </div>
                <span className='text-sm text-blue-600'>{cmp?.jobType}</span>
              </div>
            </div>
      
            <div className='hidden w-1/4 h-full md:flex items-center'>
              <p className='text-base text-start'>{cmp?.location}</p>
              <p className='w-8 md:w-12 h-8 md:h-12 rounded'>{cmp?.name}</p>
            </div>
      
            <div className='w-1/4 h-full flex flex-col items-center'>
              <p className='text-blue-600 font-semibold'>{cmp?.jobPosts?.length}</p>
              <span className='text-xs md:base font-normal text-gray-600'>
                Jobs Posted
              </span>
            </div>
          </div>
          ))}

          {isFetching && (
            <div className='mt-10'>
              <Loading />
            </div>
          )}

          <p className='text-sm text-right'>
            {data?.length} records out of {recordsCount}
          </p>
        </div>

        {numPage > page && !isFetching && (
          <div className='w-full flex items-center justify-center pt-16'>
            <CustomButton
              onClick={handleShowMore}
              title='Load More'
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;