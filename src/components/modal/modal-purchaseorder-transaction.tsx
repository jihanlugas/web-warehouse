

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
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { PurchaseorderView } from '@/types/purchaseorder';
import { displayDateTime, displayMoney, displayNumber } from '@/utils/formater';



type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  relatedId: Yup.string().required('Required field'),
  relatedType: Yup.string().required('Required field'),
  type: Yup.string().required('Required field'),
  notes: Yup.string().max(200, 'Must be 200 characters or less'),
  amount: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: CreateTransaction = {
  relatedId: '',
  relatedType: 'PURCHASE_ORDER',
  type: 'PAYMENT',
  amount: '',
  notes: '',
}

const ModalPurchaseorderTransaction: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [initFormikValue, setInitFormikValue] = useState<CreateTransaction>(defaultInitFormikValue)
  const [purchaseorder, setPurchaseorder] = useState<PurchaseorderView>(null)


  const preloads = 'Purchaseorderproduct,Purchaseorderproduct.Product'
  const { data, isLoading } = useQuery({
    queryKey: ['purchaseorder', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/purchaseorder/' + selectedId, { preloads }) : null
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

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
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
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            {purchaseorder && (
              <>
                <div className="mb-4">
                  <div>
                    <div>Purchaseorder</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{purchaseorder?.number}</div>
                    <div className="text-gray-600">{'Notes'}</div>
                    <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{purchaseorder?.notes || '-'}</div>
                    {purchaseorder.purchaseorderproducts.map((purchaseorderproduct) => (
                      <>
                        <div className="text-gray-600">{'Product'}</div>
                        <div className="col-span-1 sm:col-span-4">{purchaseorderproduct?.product?.name}</div>
                        <div className="text-gray-600">{'Unit Price'}</div>
                        <div className="col-span-1 sm:col-span-4">{displayMoney(purchaseorderproduct?.unitPrice)}</div>
                      </>
                    ))}
                    <div className="text-gray-600">{'Total Price'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayMoney(purchaseorder?.totalPrice)}</div>
                    <div className="text-gray-600">{'Total Payment'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayMoney(purchaseorder?.totalPayment)}</div>
                    {purchaseorder?.outstanding && (
                      <>
                        <div className="text-gray-600">{'Outstanding'}</div>
                        <div className="col-span-1 sm:col-span-4 text-rose-500">{displayMoney(purchaseorder?.outstanding)}</div>
                      </>
                    )}
                  </div>
                </div>
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
                              placeholder={'Amount'}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <TextAreaField
                              label={'Notes'}
                              name={'notes'}
                              placeholder={'Notes'}
                            />
                          </div>
                          <div className="mb-4">
                            <ButtonSubmit
                              label={'Save'}
                              disabled={isPending}
                              loading={isPending}
                            />
                          </div>
                        </Form>
                      )
                    }}
                  </Formik>
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