import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {
  socket: Socket;
};

const NameForm = (props: Props) => {
  useEffect(() => {
    props.socket.on("name received", (response: {success: boolean, message: string}) => {
        console.log("response from server: ", response);
    })
  }, []);

  const [name, setName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const onSaveNameButtonClick = () => {
    console.log("attempting to get the name: " + name);

    // check if the name hasn't been entered
    if (name === null || name === "") {
        setErrorMessage((prev) => "Please Enter a Name to Continue.")
        setTimeout(() => {
            setErrorMessage((prev) => "");
        }, 5000);

        return;
    }

    props.socket.emit("assign name", name);
  };

  const onNameChangeEvent = (event: any) => {
    setName(event.target.value);
  };

  return (
    <>
      <div>Enter your name</div>
      {errorMessage != "" && <div>{errorMessage}</div>}
      <input type="text" value={name} onChange={onNameChangeEvent} />
      <button onClick={onSaveNameButtonClick}>Submit</button>
    </>
  );
};

export default NameForm;
