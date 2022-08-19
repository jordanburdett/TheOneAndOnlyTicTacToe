import React from 'react'
import styled from 'styled-components';
import { User } from '../../../common/Interfaces/Queue';

type Props = {
    queue: User[];
}

const ListItem = styled("div")`
    text-align: left;
`;

const List = styled("div")`
    padding: 20px;
    margin: 20px;
`;

const QueueList = (props: Props) => {
  return (
    <List>
        {props.queue.map((user, index) => {
            return <ListItem key={index}>{index + 1} : {user.name}</ListItem>
        })}
    </List>
  )
}

export default QueueList