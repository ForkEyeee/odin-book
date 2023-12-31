'use client';
import {
  Box,
  Input,
  VStack,
  FormControl,
  InputGroup,
  InputRightElement,
  Heading,
  HStack,
  IconButton,
  Avatar,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import Link from 'next/link';
import Message from './Message';
import { BsSendFill } from 'react-icons/bs';
import { createMessage } from '../lib/actions';
import { useFormState } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { Message as MessageType } from '../lib/definitions';

interface MessageProps {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  read: boolean;
}

interface ChatProps {
  messages: MessageProps[];
  recipient: string;
  sender: string;
  receiverId: number;
  profilePicture: string;
  unReadMessages: MessageType[];
}

const initialState = {
  id: null,
  content: '',
  senderId: null,
  receiverId: null,
  createdAt: '',
  read: undefined,
};

export default function Chat({
  messages,
  recipient,
  receiverId,
  profilePicture,
  unReadMessages,
}: ChatProps) {
  const [state, formAction] = useFormState(createMessage, initialState);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const toast = useToast();

  useEffect(() => {
    if (state.id !== null) {
      setIsSubmitted(false);
      setIsLoading(false);
      setInputText('');
    }
  }, [state, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const message = messagesEndRef.current;
    if (message === null) return;
    message.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isSubmitted === false) {
      toast({
        position: 'top',
        title: 'Message sent.',
        description: 'Message has been sent successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    setIsSubmitted(null);
  }, [isSubmitted, toast]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      h={{ base: '92.5vh', xl: '93.5vh' }}
      overflowY={{ base: 'auto', lg: 'scroll' }}
    >
      <Box p={{ xl: 5 }} bg="inherit">
        <HStack justifyContent={'flex-start'} p={2}>
          <Link
            href={{
              pathname: '/profile',
              query: {
                userid: receiverId,
              },
            }}
          >
            <Avatar size={{ base: 'sm', md: 'md' }} name="John Doe" src={profilePicture} />
          </Link>
          <Heading size={{ base: 'sm' }} color={'white'} noOfLines={1}>
            {recipient}
          </Heading>
        </HStack>
      </Box>
      <VStack flex="1" py={2} px={{ base: 2, md: 5 }}>
        {messages !== undefined &&
          messages.map(message => {
            const backGround = message.receiverId === receiverId ? 'blue' : 'white';
            const isUnread =
              unReadMessages &&
              unReadMessages.find(unReadMessage => unReadMessage.id === message.id) !== undefined
                ? true
                : false;
            return (
              <Box key={message.id} w={'100%'}>
                <Message
                  justifyContent={message.receiverId !== receiverId ? 'flex-start' : 'flex-end'}
                  color={message.receiverId === receiverId ? 'white' : 'black'}
                  backGround={backGround}
                  popOverPlacement={message.receiverId === receiverId ? 'left' : 'right'}
                  content={message.content}
                  messageId={message.id}
                  receiverId={message.receiverId}
                  isRead={isUnread}
                />
                <Box ref={messagesEndRef} />
              </Box>
            );
          })}
      </VStack>
      <Box position="sticky" bottom="0" p={2} pb={0}>
        <form
          onSubmit={() => {
            setIsSubmitted(true);
            setIsLoading(true);
          }}
          action={formAction}
        >
          <FormControl>
            <InputGroup>
              <InputRightElement>
                {isLoading ? (
                  <Spinner color="black" />
                ) : (
                  <IconButton aria-label="send-message" type="submit" id="chat-submit-btn">
                    <BsSendFill color="black" />
                  </IconButton>
                )}
              </InputRightElement>
              <Input
                role="chat-input"
                type="text"
                name="message"
                placeholder={`Message ${recipient}`}
                maxLength={200}
                onChange={e => setInputText(e.currentTarget.value)}
                value={inputText}
                required
                bg={'whitesmoke'}
                color={'black'}
                size={'md'}
                id="chat-input"
              />
              <input type="hidden" name="receiverId" value={receiverId} />
            </InputGroup>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
}
