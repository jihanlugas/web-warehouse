import Breadcrumb from '@/components/component/breadcrumb';
import MainAuth from '@/components/layout/main-auth';
import PageWithLayoutType from '@/types/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { LoginUser } from '@/types/auth';
import { displayDate } from '@/utils/formater';
import { FcGoogle } from 'react-icons/fc';


type Props = {
  loginUser: LoginUser
}

const Account: NextPage<Props> = ({ loginUser }) => {

  const user = loginUser.user

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Akun'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Akun', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
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
        {/* <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='tetx-xl'>Link Akun</div>
          <div className='flex items-center justify-center p-2 border-2 border-gray-300 rounded mt-4 w-full max-w-lg'>
            <FcGoogle size={'1.2rem'} className='mr-2' />
            <div>{user.userproviders?.find(data => data.providerName === 'google').email || 'Link with Google'}</div>
          </div>
        </div> */}
      </div>
    </>
  );
}

(Account as PageWithLayoutType).layout = MainAuth;

export default Account;