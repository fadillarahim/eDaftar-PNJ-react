import React from "react";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";

const CustomTag = ({ color, text, leftIcon, size="md" }) => {
  return (
    <Tag size={size} colorScheme={color} borderRadius="full" w={"fit-content"}>
      {leftIcon ? <TagLeftIcon as={leftIcon} /> : ""}
      <TagLabel color={color}>{text}</TagLabel>
    </Tag>
  );
};

export default CustomTag;
