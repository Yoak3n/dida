import React,{ createContext } from "react";
import { MessageInstance } from "antd/es/message/interface";

interface MessageContextType {
    messageApi: MessageInstance;
    contextHolder: React.ReactNode;
  }

const Ctx = createContext<MessageContextType | null>(null);

export default Ctx;