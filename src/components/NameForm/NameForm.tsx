import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
  nameAssigned: Function;
};

const NameForm = (props: Props) => {
  useEffect(() => {
    props.socket.on("name received", (response: { success: boolean, name: string, message: string }) => {

      console.log("valid name assigned with value of " + name);

      if (response.success) {
        props.nameAssigned(name)
      }
    })
  }, []);

  const [name, setName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const onSaveNameButtonClick = () => {
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
      <button onClick={onSaveNameButtonClick}>normal save Name</button>
    </>
  );
};

export default NameForm;
