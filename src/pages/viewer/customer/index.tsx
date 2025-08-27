import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { CustomerView, PageCustomer } from "@/types/customer";
import PageWithLayoutType from "@/types/layout";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainViewer from "@/components/layout/main-viewer";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { ImSpinner2 } from "react-icons/im";
import { LuUser } from "react-icons/lu";

type Props = object


const Index: NextPage<Props> = () => {

  const [customers, setCustomers] = useState<CustomerView[]>([]);

  const [pageRequest] = useState<PageCustomer>({
    limit: 10,
    page: 1,
    preloads: "",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['customer', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setCustomers(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Customer'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Customer', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <ImSpinner2 className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              {customers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4">
                  {customers.map((customer) => {
                    return (
                      <div key={customer.id} className="p-2 border-l-4 border-gray-400 rounded text-sm">
                        <div className="flex items-center ">
                          <LuUser className={'mr-2'} size={'1.2rem'} />
                          <div>{customer.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='w-full text-center my-4'>
                  <div className='flex justify-center items-center mb-4'>
                    <PiFolderOpenDuotone size={'3rem'} className={'text-gray-500'} />
                  </div>
                  <div>
                    {'Data Tidak Ditemukan'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainViewer;

export default Index;