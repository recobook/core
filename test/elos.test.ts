// deno-lint-ignore-file
import { assertEquals} from "https://deno.land/std@0.103.0/testing/asserts.ts";

import {
    create_elo,
    update_elo
} from '../src/service/elo.service.ts'

Deno.test("Deveria criar um elo", async () => {
    
    const { error,message } = await create_elo({
        address:  "Almirante Carlos da Silveira Carneiro, 394",
        category: "caro",
        description: ":)",
        id_user: 3
    })

    console.log(message)

    assertEquals<boolean>(error,false)

});

Deno.test("Deveria atualiza um elo", async () => {
    
    const { error,message } = await update_elo({
        id: 1,
        address:  "Almirante Carlos da Silveira Carneiro, 394",
        category: "caro",
        description: ":)",
        id_user: 3
    })

    console.log(message)

    assertEquals<boolean>(error,false)

});