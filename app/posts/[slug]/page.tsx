import { Post } from '@/app/components/Post';
import { getPost, getUserId } from '@/app/lib/actions';
import NoDataFound from '@/app/components/NoDataFound';
import { Box } from '@chakra-ui/react';

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    if (params.slug === null) throw new Error();

    const postId = Number(params.slug);

    const [userId, post] = await Promise.all([getUserId(), getPost(postId)]);

    if (post === null || userId === undefined) return <NoDataFound />;

    return (
      <Box mt={10} h={'100vh'}>
        <Post post={post} userId={userId} />
      </Box>
    );
  } catch (error) {
    return <NoDataFound />;
  }
}
