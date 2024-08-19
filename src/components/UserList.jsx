import React, { useEffect, useState } from "react";
import loadingimg from "../assets/loading.gif";

const UserList = () => {
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(null);

  useEffect(() => {
    // setloading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`response is not ok status code: ${res.status}`);
      })
      .then((data) => {
        setusers(data);
        setTimeout(() => {
          setloading(false);
        }, 200);
      })
      .catch((err) => {
        seterror("error: occured ");
        setloading(false);
      });
  }, []);
  console.log(users);

  if (loading) {
    return (
      <div className="flex justify-center h-screen w-full bg-black/10 items-center">
        <div className="size-[100px]">
          <img
            src={loadingimg}
            id="loadingImg"
            className="h-full w-full object-cover"
            alt="loading..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-red-600 flex justify-center items-center">
        <h1 className="text-[7vw] font-bold font-serif text-white uppercase leading-3 ">
          Error Occured
        </h1>
      </div>
    );
  }
  return (
    <div className="p-16">
      <h1 className="text-left text-[4vw] border-b border-gray-500 mb-4 font-semibold">
        UserList :{" "}
      </h1>
      <div className="flex-col flex gap-2">
        {users.map((user, id) => (
          <ul className="border-b w-fit border-gray-500" key={user.id}>
            <li>
              {" "}
              {id + 1}. {user.name}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default UserList;
