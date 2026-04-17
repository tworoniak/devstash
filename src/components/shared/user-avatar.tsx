import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface UserAvatarProps {
  name: string | null | undefined;
  image: string | null | undefined;
  className?: string;
  size?: number;
}

export function UserAvatar({ name, image, className, size = 28 }: UserAvatarProps) {
  return (
    <Avatar className={className} style={{ width: size, height: size }}>
      {image ? (
        <Image
          src={image}
          alt={name ?? 'User'}
          width={size}
          height={size}
          className='rounded-full object-cover'
        />
      ) : (
        <AvatarFallback
          className='text-[11px] bg-blue-600 text-white'
          style={{ fontSize: size < 32 ? 11 : 14 }}
        >
          {name ? getInitials(name) : '?'}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
