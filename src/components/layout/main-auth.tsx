import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/header';
import SidebarUser from '@/components/layout/sidebar-operator';
import SidebarAdmin from '@/components/layout/sidebar-admin';
import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { USER_ROLE_ADMIN } from '@/utils/constant';
import { LoginUser } from '@/types/auth';
import { ImSpinner2 } from 'react-icons/im';

type Props = {
  children: React.ReactElement<{ loginUser: LoginUser }>
}

const Loading: React.FC = () => {
  return (
    <div className='h-dvh w-screen flex justify-center items-center'>
      <ImSpinner2 className={'absolute animate-spin text-blue-500'} size={'6em'} />
    </div>
  )
}

const MainAuth: React.FC<Props> = ({ children }) => {
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
    if (dataLoginUser?.status) {
      setLoginUser(dataLoginUser?.payload)
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
            {loginUser.user.userRole === USER_ROLE_ADMIN ? (
              <SidebarAdmin
                sidebar={sidebar}
                onClickOverlay={onClickOverlay}
              />
            ) : (
              <SidebarUser
                sidebar={sidebar}
                onClickOverlay={onClickOverlay}
                userprivilege={loginUser.user.userprivilege}
                warehouse={loginUser.warehouse}
              />
            )}
            <div className={`block duration-300 ease-in-out pt-16 min-h-svh overflow-y-auto`}>
              {React.isValidElement(children) ? React.cloneElement(children, { loginUser }) : children}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
};

export default MainAuth;