export default interface Queues {
    XQueue: User[];
    YQueue: User[]; 
}

export interface User {
    socketId: string;
    name: string;
}