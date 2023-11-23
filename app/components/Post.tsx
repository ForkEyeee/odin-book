'use client';
import {
  Box,
  Text,
  Flex,
  Avatar,
  Spacer,
  IconButton,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  VStack,
  HStack,
  Center,
} from '@chakra-ui/react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { PostProps } from '../lib/definitions';
import Link from 'next/link';
import { deletePost, likePost } from '../lib/actions';
import Comment from './Comment';
import { useFormState } from 'react-dom';
import { createComment } from '../lib/actions';
import { getFile } from '../lib/actions';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const initialState = { message: null, errors: {} };

export function Post({ post, index, userId }: PostProps) {
  const [state, formAction] = useFormState(createComment, initialState);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (state !== null) setInputText('');
  }, [state]);

  const isLiked = post.likes.find(element => element.authorId === userId);
  return (
    <Center>
      <Box
        borderWidth="1px"
        borderRadius="md"
        padding={{ base: '20px' }}
        maxW={{ base: '100%', sm: '90%' }}
        minW={{ sm: '90%' }}
        boxShadow="md"
        mt={index > 0 ? 10 : 0}
        className="test"
      >
        <HStack alignItems={'flex-start'} justifyContent={'space-between'}>
          <Flex className="tt" justifyContent={'space-between'}>
            <Box ml={2}>
              <Flex width="100%" gap={10} alignItems={'flex-start'}>
                <Link href={`/profile/${post.author.id}`}>
                  <Avatar
                    size={{ base: 'sm', sm: 'md' }}
                    name="John Doe"
                    src={`${post.author.profilePicture}`}
                  />
                </Link>
                <VStack alignItems={'flex-start'}>
                  <Text fontWeight="bold">{post.author.name}</Text>
                  <Text noOfLines={{ base: 1 }} color="gray.500">
                    {post.author.email}
                  </Text>
                  <Text color="gray.500">{post.createdAt.toDateString()}</Text>
                </VStack>
              </Flex>

              <Text mt="4" mb={{ base: 3 }} minW={{ base: '200px', sm: '330px' }}>
                {post.content}
              </Text>
              {post.imageUrl !== null && (
                <HStack alignItems={'flex-start'} justifyContent={'space-between'}>
                  <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
                    <Image
                      alt="post image"
                      src={`${post.imageUrl}`}
                      width={0}
                      height={0}
                      unoptimized={true}
                      loading="lazy"
                      // layout="fill"
                      objectFit="cover"
                      style={{ width: '100%', height: 'auto' }} // optional
                    />
                  </div>
                </HStack>
              )}
            </Box>
          </Flex>
          <Flex alignItems={'flex-start'}>
            <IconButton
              aria-label="Delete post"
              icon={<FaTrash />}
              onClick={() => deletePost(post.id)}
              size="sm"
              _hover={{
                bg: 'red',
                color: 'black',
              }}
              ml="auto" // This applies margin-left auto to push the icon to the right
            />
          </Flex>
        </HStack>
        <Flex justifyContent={'flex-end'} mt={{ base: '10px' }}>
          <HStack spacing={0}>
            <IconButton
              aria-label="Like"
              icon={<FaHeart color={isLiked ? '#f91880' : '#71767C'} />}
              onClick={() => likePost(post.id)}
              _hover={{
                bg: 'pink.200',
              }}
              size="md"
              isRound
            />
            <Text color={'#71767C'}>{post.likes.length}</Text>
          </HStack>
        </Flex>
        <form action={formAction}>
          <VStack alignItems={'flex-end'} spacing={5}>
            <FormControl mt={5}>
              <input type="hidden" name="postId" value={post.id} />
              <Textarea
                name="comment"
                placeholder="Post your reply"
                onChange={e => setInputText(e.currentTarget.value)}
                value={inputText}
              />
            </FormControl>
            <Button
              type="submit"
              variant={'solid'}
              _hover={{
                bg: 'green',
                // color: 'black',
              }}
            >
              Submit
            </Button>
          </VStack>
        </form>
        {post.comments !== undefined && post.comments.length > 0 && (
          <Comment comments={post.comments} post={post} userId={userId} />
        )}
      </Box>
    </Center>
  );
}
