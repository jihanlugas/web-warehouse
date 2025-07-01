import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { OutboundView } from "@/types/outbound";
import { displayDateTime, displayNumber, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditOutbound from "@/components/modal/modal-edit-outbound";
import MainOperator from "@/components/layout/main-operator";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [outbound, setOutbound] = useState<OutboundView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditOutbound, setShowModalEditOutbound] = useState<boolean>(false);

  const preloads = 'Stockmovement,Stockmovement.ToWarehouse,Vehicle'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['outbound', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/outbound/' + id, { preloads }) : null
    },
  })

  const toggleModalEditOutbound = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOutbound(!showModalEditOutbound);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setOutbound(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Outbound Detail'}</title>
      </Head>
      <ModalEditOutbound
        show={showModalEditOutbound}
        onClickOverlay={toggleModalEditOutbound}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Outbound', path: '/outbound' },
            { name: outbound?.number || id, path: '' },
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
                  <div>Outbound</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Outbound'
                    onClick={() => toggleModalEditOutbound(outbound?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Vehicle</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Vehicle Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.vehicle?.name || '-'}</div>
                    <div className="text-gray-600">{'Plate Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.vehicle?.plateNumber || '-'}</div>
                    <div className="text-gray-600">{'Driver Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.vehicle?.driverName || '-'}</div>
                    <div className="text-gray-600">{'Phone Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(outbound?.vehicle?.phoneNumber) || '-'}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Detail</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Destination'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.stockmovement?.toWarehouse?.name || '-'}</div>
                    <div className="text-gray-600">{'Remark'}</div>
                    <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{outbound?.remark || '-'}</div>
                    <div className="text-gray-600">{'Sent Gross Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(outbound?.sentGrossQuantity)}</div>
                    <div className="text-gray-600">{'Sent Tare Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(outbound?.sentTareQuantity)}</div>
                    <div className="text-gray-600">{'Sent Net Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(outbound?.sentNetQuantity)}</div>
                    <div className="text-gray-600">{'Sent Time'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(outbound?.sentTime) || '-'}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(outbound?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="col-span-1 sm:col-span-4">{outbound?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(outbound?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(outbound, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainOperator;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;