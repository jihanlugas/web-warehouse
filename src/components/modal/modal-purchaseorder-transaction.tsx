

import { CreateTransaction } from '@/types/transaction';
import { NextPage } from 'next/types';
import * as Yup from 'yup';
import Modal from './modal';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import ButtonSubmit from '../formik/button-submit';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import notif from '@/utils/notif';
import { Api } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import TextAreaField from '../formik/text-area-field';
import TextFieldNumber from '../formik/text-field-number';
import { ImSpinner2 } from 'react-icons/im';
import { PurchaseorderView } from '@/types/purchaseorder';
import { displayDate, displayMoney, displayPhoneNumber, displayTon } from '@/utils/formater';
import { PiFolderOpenDuotone } from 'react-icons/pi';
import { Tooltip } from 'react-tooltip';



type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  relatedId: Yup.string().required('Required field'),
  transactionRelated: Yup.string().required('Required field'),
  type: Yup.string().required('Required field'),
  notes: Yup.string().max(200, 'Must be 200 characters or less'),
  amount: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: CreateTransaction = {
  relatedId: '',
  transactionRelated: 'PURCHASE_ORDER',
  type: 'PAYMENT',
  amount: '',
  notes: '',
}

const ModalPurchaseorderTransaction: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [initFormikValue, setInitFormikValue] = useState<CreateTransaction>(defaultInitFormikValue)
  const [purchaseorder, setPurchaseorder] = useState<PurchaseorderView>(null)


  const preloads = 'Customer,Purchaseorderproducts,Stockmovementvehicles,Stockmovementvehicles.Vehicle,Stockmovementvehicles.Product,Transactions'
  const { data, isLoading } = useQuery({
    queryKey: ['purchase-order', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/purchase-order/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['transaction', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/transaction', val),
  });

  const handleSubmit = async (values: CreateTransaction, formikHelpers: FormikHelpers<CreateTransaction>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay('', true)
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setPurchaseorder(data.payload)
        setInitFormikValue({
          ...initFormikValue,
          relatedId: data.payload.id,
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
      setPurchaseorder(null)
    }
  }, [show, id])

  const RenderStatus = ({ status }) => {
    switch (status) {
      case "LOADING":
        return (
          <div className="p-2 ">
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} >{status}</span>
          </div>
        )
      case "COMPLETED":
        return (
          <div className="p-2 ">
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} >{status}</span>
          </div>
        )
      default:
        break;
    }
  }

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-4xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Transaction</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <ImSpinner2 className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            {purchaseorder && (
              <>
                <div className="mb-4">
                  <div className='mb-2'>
                    <div className='text-xl'>Purchase Order</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{purchaseorder?.number}</div>
                    <div className="text-gray-600">{'Customer'}</div>
                    <div className="col-span-1 sm:col-span-4">{purchaseorder.customer?.name}</div>
                    <div className="text-gray-600">{'Nomor Telepon'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(purchaseorder.customer?.phoneNumber)}</div>
                    <div className="text-gray-600">{'Catatan'}</div>
                    <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{purchaseorder?.notes || '-'}</div>
                  </div>
                </div>
                <div className='mb-4'>
                  <div className='mb-2'>
                    <div className='text-xl'>Delivery</div>
                  </div>
                  <table className="w-full table-auto">
                    <thead className="">
                      <tr className="text-left border-2 border-gray-400">
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Vehicle</div>
                        </th>
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Product</div>
                        </th>
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Status</div>
                        </th>
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Unit Price</div>
                        </th>
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Net</div>
                        </th>
                        <th className="border-2 border-gray-400">
                          <div className="p-2 text-base font-normal">Price</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseorder.stockmovementvehicles && purchaseorder.stockmovementvehicles.length > 0 ? (
                        <>
                          {purchaseorder.stockmovementvehicles.map((stockmovementvehicle) => {
                            return (
                              <tr key={stockmovementvehicle.id} className="p-4 border-2 border-gray-400">
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    <div data-tooltip-id={`tootltip-purhcaseorder-vehicle-${stockmovementvehicle.id}`}>
                                      {stockmovementvehicle.vehicle?.name}
                                    </div>
                                    {stockmovementvehicle.vehicle && (
                                      <Tooltip id={`tootltip-purhcaseorder-vehicle-${stockmovementvehicle.id}`}>
                                        <div className="font-bold">{stockmovementvehicle.vehicle?.name}</div>
                                        <div className="">{stockmovementvehicle.vehicle?.driverName}</div>
                                        <div className="">{displayPhoneNumber(stockmovementvehicle.vehicle?.phoneNumber)}</div>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    {stockmovementvehicle.product?.name}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 ">
                                  <RenderStatus status={stockmovementvehicle.stockmovementvehicleStatus} />
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(stockmovementvehicle.unitPrice)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400">
                                  <div className="p-2 text-right">
                                    <div data-tooltip-id={`tootltip-purhcaseorder-net-${stockmovementvehicle.id}`}>
                                      {stockmovementvehicle.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(stockmovementvehicle.sentNetQuantity as number) : "-"}
                                    </div>
                                  </div>
                                  <Tooltip id={`tootltip-purhcaseorder-net-${stockmovementvehicle.id}`} className=''>
                                    <div className="font-bold w-40">{"Detail"}</div>
                                    <hr className='border-gray-500 border-1 my-2' />
                                    <div className="flex justify-between items-center">
                                      <div className=''>Tare</div>
                                      <div className='text-right'>{displayTon(stockmovementvehicle.sentTareQuantity as number)}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className=''>Gross</div>
                                      <div className='text-right'>{displayTon(stockmovementvehicle.sentGrossQuantity as number)}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className=''>Net</div>
                                      <div className='text-right'>{displayTon(stockmovementvehicle.sentNetQuantity as number)}</div>
                                    </div>
                                  </Tooltip>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {stockmovementvehicle.stockmovementvehicleStatus === 'COMPLETED' ? displayMoney(stockmovementvehicle.sentNetQuantity * stockmovementvehicle.unitPrice) : "-"}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </>
                      ) : (
                        <tr className="border-2 border-gray-400">
                          <td colSpan={6} className="">
                            <div className='w-full text-center my-4'>
                              <div className='flex justify-center items-center mb-4'>
                                <PiFolderOpenDuotone size={'3rem'} className={'text-gray-500'} />
                              </div>
                              <div>
                                {'Data Tidak Ditemukan'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className='mb-4'>
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="text-lg">Transaction</div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center mb-2 font-bold">
                        <div>Total Price</div>
                        <div>{displayMoney(purchaseorder.totalPrice)}</div>
                      </div>
                      <hr className='border-1 border-gray-100 my-2' />
                      {purchaseorder.transactions && (
                        <>
                          {purchaseorder.transactions.map(transaction => {
                            return (
                              <div key={transaction.id} className="flex justify-between items-center mb-2">
                                <div>{transaction.notes ? displayDate(transaction.createDt) + ' | ' + transaction.notes : displayDate(transaction.createDt)}</div>
                                <div>{displayMoney(transaction.amount)}</div>
                              </div>
                            )
                          })}
                          <div className="flex justify-between items-center mb-2 font-bold text-green-500">
                            <div>Total Payment</div>
                            <div>{displayMoney(purchaseorder.totalPayment)}</div>
                          </div>
                          <hr className='border-1 border-gray-100 my-2' />
                        </>
                      )}
                      {purchaseorder.outstanding > 0 && (
                        <div className="flex justify-between items-center mb-2 font-bold text-rose-500">
                          <div>Outstanding</div>
                          <div>{displayMoney(purchaseorder.outstanding)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <hr className='border border-gray-200 my-2' /> */}
                <div className='mb-4'>
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="text-lg">Payment</div>
                    <div className="col-span-2">
                      <div className="ml-auto">
                        <Formik
                          initialValues={initFormikValue}
                          validationSchema={schema}
                          enableReinitialize={true}
                          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
                        >
                          {({ setFieldValue }) => {
                            return (
                              <Form noValidate={true}>
                                <div className="mb-4">
                                  <TextFieldNumber
                                    label={'Amount'}
                                    name={`amount`}
                                    placeholder={'1...'}
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <TextAreaField
                                    label={'Catatan'}
                                    name={'notes'}
                                    placeholder={'Catatan'}
                                  />
                                </div>
                                <div className="mb-4">
                                  <ButtonSubmit
                                    label={'Simpan'}
                                    disabled={isPending}
                                    loading={isPending}
                                  />
                                </div>
                              </Form>
                            )
                          }}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalPurchaseorderTransaction;