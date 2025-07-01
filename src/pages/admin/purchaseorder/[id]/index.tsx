import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PurchaseorderView } from "@/types/purchaseorder";
import { displayDateTime } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditPurchaseorder from "@/components/modal/modal-edit-purchaseorder";
import MainAdmin from "@/components/layout/main-admin";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [purchaseorder, setPurchaseorder] = useState<PurchaseorderView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditPurchaseorder, setShowModalEditPurchaseorder] = useState<boolean>(false);

  const preloads = ''
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['purchaseorder', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/purchaseorder/' + id, { preloads }) : null
    },
  })

  const toggleModalEditPurchaseorder = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditPurchaseorder(!showModalEditPurchaseorder);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setPurchaseorder(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Purchaseorder Detail'}</title>
      </Head>
      <ModalEditPurchaseorder
        show={showModalEditPurchaseorder}
        onClickOverlay={toggleModalEditPurchaseorder}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Purchaseorder', path: '/admin/purchaseorder' },
            { name: purchaseorder?.number.toString()  || id, path: '' },
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
                  <div>Purchaseorder</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Purchaseorder'
                    onClick={() => toggleModalEditPurchaseorder(purchaseorder?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-1 sm:col-span-4">{purchaseorder?.number}</div>
                  <div className="text-gray-600">{'Notes'}</div>
                  <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{purchaseorder?.notes || '-'}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-1 sm:col-span-4">{purchaseorder?.createName}</div>
                  <div className="text-gray-600">{'Create Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(purchaseorder?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-1 sm:col-span-4">{purchaseorder?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(purchaseorder?.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(purchaseorder, null, 4)}
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