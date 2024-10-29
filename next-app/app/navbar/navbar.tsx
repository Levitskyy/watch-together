import logo from '@/public/logo.svg';
import Link from 'next/link';
import Image from 'next/image';
import AuthButtons from './authButtons';

export default async function Navbar() {
    return (
        <nav className="bg-neutral-800 shadow-md">
            <div className="mx-auto flex justify-between px-4 py-2 items-center">
                <div className="flex items-center space-x-4">
                    <Image src={logo} alt="Logo" className="h-10 w-10 filter invert" />
                    <Link href="/" className="text-white text-2xl font-bold md:block">WatchParty</Link>
                </div>
                <div className="flex space-x-6 items-center">
                    <Link href="/animes">Список аниме</Link>
                    <Link href="/room">Создать комнату</Link>
                </div>
                <div className='flex'>
                    <AuthButtons/>
                </div>
            </div>
        </nav>
    );
};