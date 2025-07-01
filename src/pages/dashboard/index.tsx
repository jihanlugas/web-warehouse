import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import Breadcrumb from '@/components/breadcrumb';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import MainOperator from '@/components/layout/main-operator';

const Index = () => {


  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  useEffect(() => {
    if (loginUser?.status) {
    }
  }, [loginUser])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Dashboard'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Dashboard', path: '' },
          ]}
        />
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainOperator;

export default Index;