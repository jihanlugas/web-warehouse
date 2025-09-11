import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { CustomerView } from "@/types/customer";
import { displayDateTime, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from 'react-icons/im';
import { RiPencilLine } from "react-icons/ri";
import ModalEditCustomer from "@/components/modal/modal-edit-customer";
import MainAdmin from "@/components/layout/main-admin";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [customer, setCustomer] = useState<CustomerView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditCustomer, setShowModalEditCustomer] = useState<boolean>(false);

  const preloads = ''
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customer', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/customer/' + id, { preloads }) : null
    },
  })

  const toggleModalEditCustomer = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditCustomer(!showModalEditCustomer);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setCustomer(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Customer Detail'}</title>
      </Head>
      <ModalEditCustomer
        show={showModalEditCustomer}
        onClickOverlay={toggleModalEditCustomer}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Customer', path: '/admin/customer' },
            { name: customer?.name || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <ImSpinner2 className={'animate-spin text-blue-500'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Customer</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Customer'
                    onClick={() => toggleModalEditCustomer(customer?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-1 sm:col-span-4">{customer?.name}</div>
                  <div className="text-gray-600">{'Email'}</div>
                  <div className="col-span-1 sm:col-span-4">{customer?.email}</div>
                  <div className="text-gray-600">{'Nomor Telepon'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(customer?.phoneNumber)}</div>
                  <div className="text-gray-600">{'Address'}</div>
                  <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{customer?.address || '-'}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-1 sm:col-span-4">{customer?.createName}</div>
                  <div className="text-gray-600">{'Tanggal Buat'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(customer?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-1 sm:col-span-4">{customer?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(customer?.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(customer, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;