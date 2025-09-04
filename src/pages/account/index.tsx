import Breadcrumb from '@/components/component/breadcrumb';
import MainAuth from '@/components/layout/main-auth';
import PageWithLayoutType from '@/types/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { LoginUser } from '@/types/auth';
import { displayDate } from '@/utils/formater';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import ModalConfirm from '@/components/modal/modal-confirm';
import { useState } from 'react';
import { Api } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import notif from '@/utils/notif';


type Props = {
  loginUser: LoginUser
}

const Account: NextPage<Props> = ({ loginUser }) => {

  const [showModalUnlink, setShowModalUnlink] = useState<boolean>(false);

  const user = loginUser.user

  const { refetch } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['auth', 'google', 'unlink'],
    mutationFn: () => Api.get('/auth/google/unlink'),
    onSuccess: ({ status, message }) => {
      if (status) {
        refetch()
        notif.success(message)
      } else {
          notif.error(message);
      }
      toogleModalUnlink();
    },
    onError: () => {
      notif.error('Please cek you connection');
      toogleModalUnlink();
    },
  })

  const toogleModalUnlink = () => {
    setShowModalUnlink(!showModalUnlink)
  }

  const handleUnlink = () => {
    mutate()
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Akun'}</title>
      </Head>
      <ModalConfirm
        show={showModalUnlink}
        onClickOverlay={toogleModalUnlink}
        onConfirm={handleUnlink}
        isLoading={isPending}
      >
        <div>
          <div className='mb-4'>Apakah anda yakin ingin unlink akun ?</div>
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Akun', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='tetx-xl font-bold mb-4'>Akun Detail</div>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-4'>
            <div className=''>Nama</div>
            <div className='col-span-1 sm:col-span-4'>{user.fullname}</div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-4'>
            <div className=''>Email</div>
            <div className='col-span-1 sm:col-span-4'>{user.email}</div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-4'>
            <div className=''>Username</div>
            <div className='col-span-1 sm:col-span-4'>{user.username}</div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-4'>
            <div className=''>Role</div>
            <div className='col-span-1 sm:col-span-4'>{user.userRole}</div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-4'>
            <div className=''>Tanggal Bergabung</div>
            <div className='col-span-1 sm:col-span-4'>{displayDate(user.createDt)}</div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='tetx-xl font-bold'>Link Akun</div>
          <div>
            {user.userproviders?.find(data => data.providerName === 'google').email ? (
              <button onClick={() => toogleModalUnlink()} className='flex items-center justify-center p-2 border-2 border-gray-300 rounded mt-4 w-full max-w-lg'>
                <FcGoogle size={'1.2rem'} className='mr-2' />
                <div>{user.userproviders?.find(data => data.providerName === 'google').email}</div>
              </button>
            ) : (
              <Link href={{ pathname: process.env.API_END_POINT + "/auth/google/link", query: { token: localStorage.getItem('token') } }} className='flex items-center justify-center p-2 border-2 border-gray-300 rounded mt-4 w-full max-w-lg'>
                <FcGoogle size={'1.2rem'} className='mr-2' />
                <div>{'Link with Google'}</div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

(Account as PageWithLayoutType).layout = MainAuth;

export default Account;