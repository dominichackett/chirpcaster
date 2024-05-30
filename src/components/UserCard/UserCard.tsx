import { TPeerMetadata } from '@/utils/types';

import { useRemotePeer } from '@huddle01/react/hooks';

interface Props {
  peerId: string;
}

function UserCard({ peerId }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: peerId });

  return (

<div
key={metadata?.peerId}
className="m-2 w-full relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
>
  <div className="flex-shrink-0">
  <img className="h-10 w-10 rounded-full" src={metadata?.profilepic} alt="" />
</div>
<div className="min-w-0 flex-1">
  <a href="#" className="focus:outline-none">
    <span className="absolute inset-0" aria-hidden="true" />
    <p className="text-sm font-medium text-gray-900">{metadata?.displayName}</p>
  </a>
</div>
</div>



  );
}

export default UserCard;