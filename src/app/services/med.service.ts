import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Med { id: string; name: string; time: string; }

@Injectable({ providedIn: 'root' })
export class MedService {
  private _ready = this.storage.create();
  constructor(private storage: Storage) {}

  async getAll(): Promise<Med[]> {
    const st = await this._ready;
    const keys = await st.keys();
    const out: Med[] = [];
    for (const k of keys) {
      const m = await st.get(k) as Med;
      if (m) out.push(m);
    }
    return out;
  }

  async get(id: string): Promise<Med|null> {
    const st = await this._ready;
    return (await st.get(id)) as Med|null;
  }

  async save(m: Med) {
    const st = await this._ready;
    await st.set(m.id, m);
  }
}
