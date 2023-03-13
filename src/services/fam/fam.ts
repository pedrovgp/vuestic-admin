import http from '../http-common'

class AnimalsApi {
  getAll(params: any) {
    // Joins params with & and adds ? to the beginning
    const query = new URLSearchParams(params).toString()
    return http.get<Array<any>>(`/animals/?${query}`)
  }

  get(id: number) {
    return http.get<any>(`/animals/${id}/`)
  }

  create(data: any) {
    return http.post<any>('/animals', data)
  }

  update({ id, data }: { id: string; data: any }) {
    console.log(id)
    return http.patch<any>(`/animals/${id}/`, data)
  }

  //   delete(id: any) {
  //     return http.delete<any>(`/tutorials/${id}`)
  //   }

  //   deleteAll() {
  //     return http.delete<any>(`/tutorials`)
  //   }

  query(q: string) {
    return http.get<Array<any>>(`/animals/?q=${q}`)
  }
}

export default new AnimalsApi()
