import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from 'react-icons/im';
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import { UpdateUserprivilege } from "@/types/userprivilage";
import CheckboxField from "../formik/checkbox-field";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
});

const defaultInitFormikValue: UpdateUserprivilege = {
  stockIn: false,
  transferIn: false,
  transferOut: false,
  purchaseorder: false,
  retail: false,

}

const ModalEditUserprivilege: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateUserprivilege>(defaultInitFormikValue)

  const preloads = 'Userprivilege'
  const { data, isLoading } = useQuery({
    queryKey: ['user', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/user/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['user', 'update', selectedId, 'privilege'],
    mutationFn: (val: FormikValues) => Api.post('/user/' + selectedId + '/privilege', val),
  });

  const handleSubmit = async (values: UpdateUserprivilege, formikHelpers: FormikHelpers<UpdateUserprivilege>) => {
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
        setInitFormikValue(data.payload.userprivilege)
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
          <div>Edit Privilege</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
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
            <div className="ml-auto">
              <Formik
                initialValues={initFormikValue}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
              >
                {({ values, errors }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="">
                          <CheckboxField
                            name="stockIn"
                            label="Stock Masuk"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="transferIn"
                            label="Pengiriman Masuk"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="transferOut"
                            label="Pengiriman Keluar"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="purchaseorder"
                            label="Purchase Order"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="retail"
                            label="Retail"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Simpan'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
                      {process.env.DEBUG === 'true' && (
                        <>
                          <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                            {JSON.stringify(values, null, 4)}
                          </div>
                          <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                            {JSON.stringify(errors, null, 4)}
                          </div>
                        </>
                      )}
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalEditUserprivilege;