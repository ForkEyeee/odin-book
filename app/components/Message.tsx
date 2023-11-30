'use client';
import {
  Flex,
  Card,
  CardBody,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  HStack,
  Input,
  Button,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { deleteMessage, updateMessage } from '../lib/actions';
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Message as MessageProps } from '../lib/definitions';

interface Props {
  justifyContent: string;
  backGround: string;
  color: string;
  content: string;
  popOverPlacement:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end';
  messageId: number;
  receiverId: number;
  senderId: number;
  messageStatus: boolean;
  unReadMessages: MessageProps[];
  isColor: string;
}

const Message = ({
  justifyContent,
  backGround,
  color,
  content,
  popOverPlacement,
  messageId,
  receiverId,
  senderId,
  messageStatus,
  unReadMessages,
  isColor,
}: Props) => {
  const initialState = { message: null, errors: {} };
  const [isEdit, setIsEdit] = useState(false);
  const [state, formAction] = useFormState(updateMessage, initialState);
  const searchParams = useSearchParams();
  const isAuthor = Number(searchParams.get('userId')) !== receiverId;

  useEffect(() => {
    if (state !== null) setIsEdit(false);
  }, [state]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  if (isColor === 'red.300') {
    console.log(isColor);
  }

  return (
    <Popover placement={popOverPlacement}>
      <Flex justifyContent={justifyContent} w={'100%'}>
        <PopoverTrigger>
          <Card
            maxW={'75%'}
            backgroundColor={isColor}
            role="message-card"
            boxShadow="md"
            borderRadius="lg"
            overflow={'hidden'}
          >
            {' '}
            <CardBody
              backgroundColor={isEdit ? 'gray.500' : isColor}
              borderRadius={isEdit ? 'lg' : 'initial'}
            >
              <form action={formAction}>
                {!isEdit ? (
                  <Text fontSize={{ base: '16px', sm: '20px' }} color={color}>
                    {content}
                  </Text>
                ) : (
                  <Box>
                    <Input
                      defaultValue={content}
                      id="message"
                      name="message"
                      required
                      size="md"
                      mb={4}
                      bg={'white'}
                      color={'black'}
                    />
                    <Flex justifyContent="flex-end">
                      <Button
                        type="button"
                        aria-label="cancel button"
                        onClick={() => setIsEdit(false)}
                        leftIcon={<CloseIcon />}
                        mr={3}
                        colorScheme="red"
                        variant={'solid'}
                      >
                        Cancel
                      </Button>
                      <input type="hidden" name="receiverId" value={receiverId} />
                      <input type="hidden" name="messageId" value={messageId} />
                      <Button type="submit" colorScheme="green" variant={'ghost'}>
                        Save
                      </Button>
                    </Flex>
                  </Box>
                )}
              </form>
            </CardBody>
          </Card>
        </PopoverTrigger>
      </Flex>
      {!isEdit && isAuthor && (
        <PopoverContent w={'fit-content'} boxShadow="md" borderRadius="lg">
          <Flex justifyContent={popOverPlacement === 'left' ? 'flex-end' : 'flex-start'}>
            <HStack spacing={5} p={1}>
              <IconButton
                aria-label="edit-button"
                onClick={() => setIsEdit(true)}
                icon={<EditIcon />}
                variant="ghost"
              />
              <IconButton
                aria-label="delete button"
                icon={<DeleteIcon color={'red'} />}
                variant="ghost"
                onClick={() => deleteMessage(messageId, receiverId)}
              />
            </HStack>
          </Flex>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default Message;
