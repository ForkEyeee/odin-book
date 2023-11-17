import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react';
import { Post } from './Post';
import { TimeLineTabsProps } from '../lib/definitions';

export function TimeLineTabs({ forYouPosts, discoverPosts, userId }: TimeLineTabsProps) {
  return (
    <Tabs isFitted variant="enclosed">
      <TabList mb="1em">
        <Tab>For You</Tab>
        <Tab>All Posts</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {forYouPosts.length !== 0 ? (
            forYouPosts.map((post, index) => (
              <Post key={post.id} post={post} index={index} userId={userId}></Post>
            ))
          ) : (
            <Text>you have no friends</Text>
          )}
        </TabPanel>
        <TabPanel>
          {discoverPosts.map((post, index) => (
            <Post key={post.id} post={post} index={index} userId={userId}></Post>
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default TimeLineTabs;
