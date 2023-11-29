import { Suspense } from 'react';
import { getMessages, getUnreadMessagesCount, setReadMessages } from '@/app/lib/actions';
import Chat from '../components/Chat';
import Loading from '../loading';
import NoDataFound from '../components/NoDataFound';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    receiverId?: string;
    page?: string;
  };
}) {
  try {
    const receiverId = Number(searchParams?.receiverId) || 0;
    const { messages, recipient, sender, profilePicture } = (await getMessages(receiverId)) as any;
    const { unReadMessages, unreadMessageCount } = await getUnreadMessagesCount(receiverId);
    if (unReadMessages === undefined || unReadMessages === null) return <NoDataFound />;

    await setReadMessages(receiverId);

    return (
      <Suspense fallback={<Loading />}>
        <Chat
          messages={messages}
          recipient={recipient}
          sender={sender}
          receiverId={receiverId}
          profilePicture={profilePicture}
          unReadMessages={unReadMessages}
        />
      </Suspense>
    );
  } catch (error) {
    return <NoDataFound />;
  }
}
