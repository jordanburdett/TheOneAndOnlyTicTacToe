import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";

type Props = {
  socket: Socket;
  nameAssigned: Function;
};

const Main = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 10px;
  column-gap: 20px;
  padding: 5px;
`;

const Header = styled("div")`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  
   div {
     width: 100%;
    
     border-radius: 7px;

     h1 {

     }
   }
`;

const MainContentWrapper = styled("div")`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  row-gap: 10px;
  column-gap: 20px;
  padding-bottom: 40px;
 

  @media (min-width: 800px) {
    flex-wrap: nowrap;
  }
`;

const SideBarLeft = styled("div")`
  width: 100%;
  text-align: center;

  

  @media (min-width: 800px) {
    width: 20%;
  }
`;

const CenterContent = styled("div")`
  display: flex;
  width: 100%;
  text-align: center;
  gap: 10px;
  justify-content: center;
  
  @media (min-width: 800px) {
    width: 50%;
  }
`;

const SideBarRight = styled("div")`
  width: 100%;
  text-align: center;
  
  @media (min-width: 800px) {
    width: 20%;
  }
`;

const Footer = styled("div")`
  width: 100%;
  text-align: center;
  
`;

const GameBoardRow = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
`;

const GameBoardSquare = styled("div")`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-size: 30px;

  width: 100px;
  height: 100px;

  border: solid whitesmoke 2px;

  &:hover {
    cursor: pointer;
    background-color: #474747;
  }
`;

const HiddenMessages = styled("h3")`
  width: 100%;
  text-align: center;
  color: #f54141;
  margin: 0;
`;

const NameInput = styled("input")`
  padding:10px;
  border-radius: 10px;
  border: none;

  &:focus {
    border: solid black 2px;
  }
`;

const SaveButton = styled("button")`
  padding:10px;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: #4141b3;
`;

const NameForm = (props: Props) => {
  useEffect(() => {
    props.socket.on("name received", (response: { success: boolean, name: string, message: string }) => {

      console.log("WE RECIEVED A RESPONSE FOR THE NAME RECIEVED", response);

      if (response.success) {
        console.log("valid name assigned with value of " + name);
        props.nameAssigned(name)
      }
      else {
        console.log("error assigning name ", response.message);
        setErrorMessage((prev) => "Please enter a different name");
        setTimeout(() => {
          setErrorMessage((prev) => "");
        }, 5000);
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
    <Main>
      <Header>
        <div>
          <h1>Welcome to Tic-Tac-Toe, Please enter your name</h1>
        </div>
      </Header>
      {errorMessage !== "" &&
        <HiddenMessages>
          {errorMessage}
        </HiddenMessages>}

      <MainContentWrapper>
        {/* SideBarLeft and sidebar right are needed to center the main content. I plan on putting something in each of these at some point */}
        <SideBarLeft></SideBarLeft>
        <CenterContent>
          <NameInput type="text" value={name} onChange={onNameChangeEvent} />
          <SaveButton onClick={onSaveNameButtonClick}>Submit Name</SaveButton>
        </CenterContent>
        <SideBarRight></SideBarRight>
      </MainContentWrapper>
    </Main>
  );
};

export default NameForm;
