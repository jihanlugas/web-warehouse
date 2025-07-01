import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { RetailView } from "@/types/retail";
import { displayDateTime } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditRetail from "@/components/modal/modal-edit-retail";
import MainAdmin from "@/components/layout/main-admin";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [retail, setRetail] = useState<RetailView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditRetail, setShowModalEditRetail] = useState<boolean>(false);

  const preloads = ''
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['retail', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/retail/' + id, { preloads }) : null
    },
  })

  const toggleModalEditRetail = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditRetail(!showModalEditRetail);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setRetail(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Retail Detail'}</title>
      </Head>
      <ModalEditRetail
        show={showModalEditRetail}
        onClickOverlay={toggleModalEditRetail}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '/admin/retail' },
            { name: retail?.number.toString()  || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Retail</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Retail'
                    onClick={() => toggleModalEditRetail(retail?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-1 sm:col-span-4">{retail?.number}</div>
                  <div className="text-gray-600">{'Notes'}</div>
                  <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{retail?.notes || '-'}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-1 sm:col-span-4">{retail?.createName}</div>
                  <div className="text-gray-600">{'Create Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(retail?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-1 sm:col-span-4">{retail?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(retail?.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(retail, null, 4)}
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