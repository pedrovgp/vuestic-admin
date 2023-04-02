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
      return http.post<any>(`/${modelName}/patch/`, data)
    },
    upsert(data: any) {
      if (data.id) return http.put<any>(`/${modelName}/patch/${data.id}/`, data)
      return http.post<any>(`/${modelName}/patch/`, data)
    },
    update({ id, data }: { id: string; data: any }) {
      return http.patch<any>(`/${modelName}/patch/${id}/`, data)
    },
    delete(id: any) {
      return http.delete<any>(`/${modelName}/patch/${id}/`)
    },

    //   deleteAll() {
    //     return http.delete<any>(`/tutorials`)
    //   }
  }
}

export default createApi
