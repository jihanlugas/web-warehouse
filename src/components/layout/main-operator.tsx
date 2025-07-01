import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/header';
import SidebarOperator from '@/components/layout/sidebar-operator';
import { Api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineLoading } from 'react-icons/ai'
import { UserView } from '@/types/user';
import { USER_ROLE_OPERATOR } from '@/utils/constant';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode
}

const Loading: React.FC = () => {
  return (
    <div className='h-dvh w-screen flex justify-center items-center'>
      <AiOutlineLoading className={'absolute animate-spin '} size={'6em'} />
    </div>
  )
}

const MainOperator: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const [sidebar, setSidebar] = useState<boolean>(false);
  const [user, setUser] = useState<UserView>();


  const { data: loginUser, isLoading } = useQuery({
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
    setUser(loginUser?.payload?.user)
  }, [loginUser])

  useEffect(() => {
    if (user && user.role !== USER_ROLE_OPERATOR) {
      router.replace('/404')
    }
  }, [user])


  return (
    <>
      <Head>
        <meta name="theme-color" content={'currentColor'} />
      </Head>
      <main className={''}>
        {!isLoading && user ? (
          <>
            <Header sidebar={sidebar} setSidebar={setSidebar} />
            <SidebarOperator
              sidebar={sidebar}
              onClickOverlay={onClickOverlay}
              userprivilege={user.userprivilege}
            />
            <div className={`block duration-300 ease-in-out pt-16 min-h-svh overflow-y-auto`}>
              {children}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
};

export default MainOperator;