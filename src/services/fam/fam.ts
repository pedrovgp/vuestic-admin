import http from '../http-common'

class AnimalsApi {
  getAll() {
    return http.get<Array<any>>('/animals/')
  }

  get(id: number) {
    return http.get<any>(`/animals/${id}`)
  }

  create(data: any) {
    return http.post<any>('/animals', data)
  }

  update(data: any, id: number) {
    return http.put<any>(`/animals/${id}`, data)
  }

  //   delete(id: any) {
  //     return http.delete<any>(`/tutorials/${id}`)
  //   }

  //   deleteAll() {
  //     return http.delete<any>(`/tutorials`)
  //   }

  query(q: string) {
    return http.get<Array<any>>(`/animals?q=${q}`)
  }
}

export default new AnimalsApi()
