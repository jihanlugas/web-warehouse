import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Modal from "./modal";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { displayDateTime, displayNumber, displayPhoneNumber, displayTon } from "@/utils/formater";



type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const RenderType = ({ type }) => {
  switch (type) {
    case "IN":
      return (
        <div className="text-lg font-bold">STOCK IN</div>
      )
    case "TRANSFER":
      return (
        <div className="text-lg font-bold">TRANSFER</div>
      )
    case "PURCHASE_ORDER":
      return (
        <div className="text-lg font-bold">PURCHASE ORDER</div>
      )
    case "RETAIL":
      return (
        <div className="text-lg font-bold">RETAIL</div>
      )
    default:
      return null
  }
}



const RenderStatus = ({ status }) => {
  switch (status) {
    case "LOADING":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    case "IN_TRANSIT":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-blue-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status.replace('_', ' ')}</span>
        </div>
      )
    case "UNLOADING":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    case "COMPLETED":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    default:
      return null
  }
}

const ModalDetailStockmovementvehicle: NextPage<Props> = ({ show, onClickOverlay, id }) => {
  const [selectedId, setSelectedId] = useState<string>('')
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView>(null)


  const preloads = 'Vehicle,Product,FromWarehouse,ToWarehouse,Purchaseorder,Purchaseorder.Customer,Retail,Retail.Customer'
  const { data, isLoading } = useQuery({
    queryKey: ['stockmovementvehicle', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/stockmovementvehicle/' + selectedId, { preloads }) : null
    },
  })


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setStockmovementvehicle(data.payload)
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Detail</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <>
            {stockmovementvehicle && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <RenderType type={stockmovementvehicle.stockmovementvehicleType} />
                    <div>{stockmovementvehicle.number}</div>
                  </div>
                  <div><RenderStatus status={stockmovementvehicle.stockmovementvehicleStatus} /></div>
                </div>
                <RenderData stockmovementvehicle={stockmovementvehicle} />
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

const RenderData: NextPage<{ stockmovementvehicle: StockmovementvehicleView }> = ({ stockmovementvehicle }) => {
  switch (stockmovementvehicle.stockmovementvehicleType) {
    case 'IN':
      return (
        <div className="mb-4">
          <div className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Product'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.product?.name || '-'}</div>
              <div className="text-gray-600">{'Catatan'}</div>
              <div className="col-span-1 sm:col-span-2 whitespace-pre-wrap">{stockmovementvehicle?.notes || '-'}</div>
              <div className="text-gray-600">{'Berat Bersih'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.receivedNetQuantity)}</div>
              <div className="text-gray-600">{'Tanggal Buat'}</div>
              <div className="col-span-1 sm:col-span-2">{displayDateTime(stockmovementvehicle.createDt)}</div>
            </div>
          </div>
        </div>
      )
    case 'TRANSFER':
      return (
        <div>
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Product'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.product?.name || '-'}</div>
              <div className="text-gray-600">{'From Warehouse'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.fromWarehouse?.name || '-'}</div>
              <div className="text-gray-600">{'To Warehouse'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.toWarehouse?.name || '-'}</div>
              <div className="text-gray-600">{'Catatan'}</div>
              <div className="col-span-1 sm:col-span-2 whitespace-pre-wrap">{stockmovementvehicle?.notes || '-'}</div>
              <div className="text-gray-600">{'Tanggal Buat'}</div>
              <div className="col-span-1 sm:col-span-2">{displayDateTime(stockmovementvehicle.createDt)}</div>
            </div>
          </div>
          {stockmovementvehicle.vehicle && (
            <div className="mb-4">
              <div className="text-lg mb-4">Kendaraan</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="text-gray-600">{'Kendaraan'}</div>
                <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.vehicle?.name || '-'}</div>
                <div className="text-gray-600">{'Nomor Kendaraan'}</div>
                <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.vehicle?.plateNumber || '-'}</div>
                <div className="text-gray-600">{'Nama Supir / Penanggung Jawab'}</div>
                <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.vehicle?.driverName || '-'}</div>
                <div className="text-gray-600">{'Nomor Telepon'}</div>
                <div className="col-span-1 sm:col-span-2">{displayPhoneNumber(stockmovementvehicle.vehicle?.phoneNumber) || '-'}</div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <div className="text-lg mb-4">Barang Dikirim</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Sent Berat Kotor'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentGrossQuantity)}</div>
              <div className="text-gray-600">{'Sent Berat Kosong'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentTareQuantity)}</div>
              <div className="text-gray-600">{'Sent Berat Bersih'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentNetQuantity)}</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-lg mb-4">Barang Diterima</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Received Berat Kotor'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.receivedGrossQuantity)}</div>
              <div className="text-gray-600">{'Received Berat Kosong'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.receivedTareQuantity)}</div>
              <div className="text-gray-600">{'Received Berat Bersih'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.receivedNetQuantity)}</div>
            </div>
          </div>
        </div>
      )
    case 'PURCHASE_ORDER':
      return (
        <div className="mb-4">
          <div className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Product'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.product?.name || '-'}</div>
              <div className="text-gray-600">{'Customer'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.purchaseorder?.customer?.name || '-'}</div>
              <div className="text-gray-600">{'Catatan'}</div>
              <div className="col-span-1 sm:col-span-2 whitespace-pre-wrap">{stockmovementvehicle?.notes || '-'}</div>
              <div className="text-gray-600">{'Berat Kotor'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentGrossQuantity)}</div>
              <div className="text-gray-600">{'Berat Kosong'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentTareQuantity)}</div>
              <div className="text-gray-600">{'Berat Bersih'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentNetQuantity)}</div>
              <div className="text-gray-600">{'Tanggal Buat'}</div>
              <div className="col-span-1 sm:col-span-2">{displayDateTime(stockmovementvehicle.createDt)}</div>
            </div>
          </div>
        </div>
      )
    case 'RETAIL':
      return (
        <div className="mb-4">
          <div className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-gray-600">{'Product'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.product?.name || '-'}</div>
              <div className="text-gray-600">{'Customer'}</div>
              <div className="col-span-1 sm:col-span-2">{stockmovementvehicle.retail?.customer?.name || '-'}</div>
              <div className="text-gray-600">{'Catatan'}</div>
              <div className="col-span-1 sm:col-span-2 whitespace-pre-wrap">{stockmovementvehicle?.notes || '-'}</div>
              <div className="text-gray-600">{'Berat Kotor'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentGrossQuantity)}</div>
              <div className="text-gray-600">{'Berat Kosong'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentTareQuantity)}</div>
              <div className="text-gray-600">{'Berat Bersih'}</div>
              <div className="col-span-1 sm:col-span-2">{displayTon(stockmovementvehicle?.sentNetQuantity)}</div>
              <div className="text-gray-600">{'Tanggal Buat'}</div>
              <div className="col-span-1 sm:col-span-2">{displayDateTime(stockmovementvehicle.createDt)}</div>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}



export default ModalDetailStockmovementvehicle;