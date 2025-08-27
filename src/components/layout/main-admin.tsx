import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/header';
import SidebarAdmin from '@/components/layout/sidebar-admin';
import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineLoading } from 'react-icons/ai'
import { USER_ROLE_ADMIN } from '@/utils/constant';
import { useRouter } from 'next/router';
import { LoginUser } from '@/types/auth';

type Props = {
  children: React.ReactElement<{ loginUser: LoginUser }>
}

const Loading: React.FC = () => {
  return (
    <div className='h-dvh w-screen flex justify-center items-center'>
      <AiOutlineLoading className={'absolute animate-spin '} size={'6em'} />
    </div>
  )
}

const MainAdmin: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const [sidebar, setSidebar] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<LoginUser>();


  const { data: dataLoginUser, isLoading } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { data: dataRefreshToken } = useQuery({
    queryKey: ['refresh-token'],
    queryFn: () => Api.get('/auth/refresh-token'),
    refetchInterval: 1000 * 60 * (process.env.REFRESH_TOKEN_MINUTES as unknown as number),
  })

  useEffect(() => {
    if (dataRefreshToken && dataRefreshToken.status) {
      localStorage.setItem('token', dataRefreshToken.payload.token)
    }
  }, [dataRefreshToken])

  const onClickOverlay = (isShow: boolean) => {
    if (isShow === undefined) {
      setSidebar(!sidebar);
    } else {
      setSidebar(isShow);
    }
  };

  useEffect(() => {
    setLoginUser(dataLoginUser?.payload)
    if (dataLoginUser?.payload.user && dataLoginUser?.payload.user?.userRole !== USER_ROLE_ADMIN) {
      router.replace('/404')
    }
  }, [dataLoginUser])


  return (
    <>
      <Head>
        <meta name="theme-color" content={'currentColor'} />
      </Head>
      <main className={''}>
        {!isLoading && loginUser ? (
          <>
            <Header sidebar={sidebar} setSidebar={setSidebar} loginUser={loginUser} />
            <SidebarAdmin sidebar={sidebar} onClickOverlay={onClickOverlay} />
            <div className={`block duration-300 ease-in-out pt-16 min-h-svh overflow-y-auto`}>
              {React.isValidElement(children) ? React.cloneElement(children, { loginUser }) : children}
            </div>
          </>
        ) : (
          <>
            <Loading />
          </>
        )}
      </main>
    </>
  );
};

export default MainAdmin;