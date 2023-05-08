import http from '../http-common'

// Generalize the above to a function that takes the model name and returns the api instance
function createApi(modelName: string) {
  return {
    getAll(params: any) {
      // Joins params with & and adds ? to the beginning
      const query = new URLSearchParams(params).toString()
      return http.get<Array<any>>(`/${modelName}/?${query}`)
    },
    get(id: number) {
      return http.get<any>(`/${modelName}/${id}/`)
    },
    create(data: any) {
      return http.post<any>(`/${modelName}/`, data)
    },
    upsert(data: any) {
      if (data.id) return http.put<any>(`/${modelName}/${data.id}/`, data)
      return http.post<any>(`/${modelName}/`, data)
    },
    update({ id, data }: { id: string; data: any }) {
      return http.patch<any>(`/${modelName}/${id}/`, data)
    },
    delete(id: any) {
      return http.delete<any>(`/${modelName}/${id}/`)
    },

    makeCheckIn(id: any, checkIn: boolean) {
      if (modelName != 'animal') {
        throw new Error('make_check_in only works for animal API')
      }
      return http.patch<any>(`/${modelName}/${id}/check_in/`, { check_in: checkIn })
    },

    updateFile({ id, data }: { id: string; data: Map<string, string | Blob> }) {
      const fd = new FormData()
      fd.append('_method', 'PATCH')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).forEach(([key, value], index) => {
        // name one_picture {PictureBlob} 0
        // fieldName File 1
        fd.append(key, value)
      })
      // fd.append('one_picture', data.one_picture)

      return http.patch<any>(`/${modelName}/${id}/`, fd, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
    },

    //   deleteAll() {
    //     return http.delete<any>(`/tutorials`)
    //   }
  }
}

export { createApi }
export default createApi
