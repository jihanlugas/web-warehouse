import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import TextFieldNumber from "../formik/text-field-number";
import { displayDateTime, displayNumber } from "@/utils/formater";
import { UpdateTransferin } from "@/types/transferin";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({

});

const defaultInitFormikValue: UpdateTransferin = {
  receivedGrossQuantity: '',
  receivedTareQuantity: '',
  receivedNetQuantity: '',
}

const ModalEditTransferin: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView>(null)
  const [initFormikValue, setInitFormikValue] = useState<UpdateTransferin>(defaultInitFormikValue)

  const preloads = 'FromWarehouse'
  const { data, isLoading } = useQuery({
    queryKey: ['stockmovementvehicle', 'transfer-in', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, , selectedId] = queryKey;
      return selectedId ? Api.get('/stockmovementvehicle/transfer-in/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-in', selectedId, 'update'],
    mutationFn: (val: FormikValues) => Api.put('/stockmovementvehicle/transfer-in/' + selectedId, val),
  });


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setStockmovementvehicle(data.payload)
        setInitFormikValue({
          receivedGrossQuantity: data.payload.receivedGrossQuantity,
          receivedTareQuantity: data.payload.receivedTareQuantity,
          receivedNetQuantity: data.payload.receivedNetQuantity,
        })
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

  const handleSubmit = async (values: UpdateTransferin, formikHelpers: FormikHelpers<UpdateTransferin>) => {
    values.receivedGrossQuantity = parseFloat(values.receivedGrossQuantity as string) || 0
    values.receivedTareQuantity = parseFloat(values.receivedTareQuantity as string) || 0
    values.receivedNetQuantity = values.receivedGrossQuantity - values.receivedTareQuantity
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

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Unloading</div>
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
          <div>
            {stockmovementvehicle && (
              <div className="">
                <div className="mb-4">
                  <div className="text-lg mb-2">
                    <div>{stockmovementvehicle?.fromWarehouse?.name}</div>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-4">
                    <div className="">Berat Kosong</div>
                    <div className="">{displayNumber(stockmovementvehicle.sentTareQuantity)}</div>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-4">
                    <div className="">Berat Kotor</div>
                    <div className="">{displayNumber(stockmovementvehicle.sentGrossQuantity)}</div>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-4">
                    <div className="">Berat Bersih</div>
                    <div className="">{displayNumber(stockmovementvehicle.sentNetQuantity)}</div>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-4">
                    <div className="">Tanggal Dikirim</div>
                    <div className="">{displayDateTime(stockmovementvehicle.sentTime)}</div>
                  </div>
                </div>
                <hr className="border-gray-300 my-2" />
                <Formik
                  initialValues={initFormikValue}
                  validationSchema={schema}
                  enableReinitialize={true}
                  onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
                >
                  {({ values }) => {
                    return (
                      <Form noValidate={true}>
                        <div className="mb-4">
                          <TextFieldNumber
                            label={'Berat Kosong'}
                            name={`receivedTareQuantity`}
                            placeholder={'1...'}
                          />
                        </div>
                        <div className="mb-4">
                          <TextFieldNumber
                            label={'Berat Kotor'}
                            name={`receivedGrossQuantity`}
                            placeholder={'1...'}
                          />
                        </div>
                        <div className="mb-4 flex justify-between items-center">
                          <div>Berat Bersih</div>
                          <div>{displayNumber((parseFloat(values.receivedGrossQuantity as string || "0") - parseFloat(values.receivedTareQuantity as string || "0")))}</div>
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
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalEditTransferin;