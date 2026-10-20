import type { EsGuide } from "./index";

export const ES_A: EsGuide[] = [
  {
    slug: "how-to-dispute-a-medical-bill",
    title: "Cómo disputar una factura médica, paso a paso",
    description: "Las facturas médicas suelen tener errores. Así puede pedir una factura detallada, encontrar cargos dobles y cobros sorpresa, pedir ayuda financiera y disputar la factura por escrito.",
    intro: "Una factura médica confusa no es la última palabra. Los hospitales y los médicos cometen errores de cobro, y usted tiene derecho a ver cada cargo y a pedir correcciones antes de pagar.",
    blocks: [
      {
        h: "Paso a paso",
        steps: [
          ["No pague todavía", "Si paga primero, será más difícil que le devuelvan el dinero. Llame a la oficina de facturación, diga que está revisando la factura y pida que no la envíen a cobranza."],
          ["Pida una factura detallada", "Pida cada cargo con su fecha, su código de facturación (CPT o HCPCS) y lo que se cobró al seguro. Una factura resumida esconde errores."],
          ["Compárela con el estado de cuenta de su seguro", "Su explicación de beneficios (EOB, por sus siglas en inglés) muestra lo que pagó su plan y lo que usted debe. La factura debe coincidir con ese documento."],
          ["Busque errores comunes", "Cargos duplicados, servicios que no recibió, un número de días incorrecto y cargos fuera de la red en un hospital que sí está en la red de su seguro."],
          ["Pregunte por la ayuda financiera", "Los hospitales sin fines de lucro deben tener una política escrita de ayuda financiera (atención de beneficencia, o \"charity care\"). Pida la solicitud, aunque piense que gana demasiado."],
          ["Dispute por escrito", "Envíe una carta corta que enumere cada error y la corrección que quiere, y guarde una copia. Una disputa por escrito deja un registro que las llamadas no dejan."],
        ],
      },
      {
        h: "Facturas sorpresa de médicos fuera de la red",
        p: ["Según la ley federal No Surprises Act (Ley Sin Sorpresas), por lo general no pueden cobrarle más que su parte dentro de la red por la atención de emergencia, ni por médicos fuera de la red en un hospital de su red que usted no eligió. Si recibe una de estas facturas, dígalo en su disputa y comuníquese con la línea de ayuda de No Surprises (No Surprises Help Desk) al 1-800-985-3059."],
      },
      {
        h: "La deuda médica y su informe de crédito",
        p: ["Las tres agencias nacionales de crédito no reportan las cuentas médicas en cobranza que ya están pagadas ni las que son menores de $500, y la deuda médica sin pagar no se agrega hasta que tiene un año. Eso le da tiempo para disputar sin que afecte su crédito."],
      },
    ],
    faqs: [
      ["¿Debo pagar una factura médica que estoy disputando?", "Por lo general no, hasta que se resuelva la disputa. Pida por escrito a la oficina de facturación que no envíen la cuenta a cobranza mientras la revisan."],
      ["¿Cuánto tiempo tengo para disputar una factura médica?", "Muchas veces no hay un solo plazo legal, pero actúe dentro de 30 días para que no pase a cobranza. Si no tenía seguro y recibió un estimado de buena fe (good faith estimate), puede disputar una factura que sea $400 o más superior al estimado dentro de 120 días."],
      ["¿Puedo negociar una factura médica?", "Sí. Muchos proveedores ofrecen descuentos por pago directo o por pago rápido, y planes de pago sin intereses. Pregunte, y pida que cualquier acuerdo quede por escrito antes de pagar."],
    ],
    cta: "Escanee su factura y le señalaremos lo que parece estar mal.",
  },
  {
    slug: "no-surprises-act-explained",
    title: "La No Surprises Act (Ley Sin Sorpresas), explicada",
    description: "De qué la protege la No Surprises Act, qué facturas cubre, cómo funcionan los estimados de buena fe si no tiene seguro y cómo presentar una queja.",
    intro: "Desde el 1 de enero de 2022, la ley federal No Surprises Act (Ley Sin Sorpresas) protege a la mayoría de las personas de las facturas sorpresa de proveedores fuera de la red. Aquí le explicamos qué cubre y cómo usarla.",
    blocks: [
      {
        h: "Qué cubre",
        list: [
          "La atención de emergencia, incluso en una sala de emergencias fuera de la red",
          "Los médicos fuera de la red en un hospital o centro de cirugía dentro de la red, como anestesiólogos o radiólogos, a menos que usted haya dado su consentimiento previo por escrito donde esté permitido",
          "Los servicios de ambulancia aérea (las ambulancias terrestres no están cubiertas)",
        ],
      },
      {
        h: "Lo que usted paga",
        p: ["En las facturas sorpresa cubiertas, solo debe su parte normal dentro de la red: su copago, su coseguro o su deducible. El proveedor y su aseguradora resuelven el resto entre ellos."],
      },
      {
        h: "Si no tiene seguro o paga por su cuenta",
        p: ["Tiene derecho a un estimado de buena fe (good faith estimate) antes de la atención programada. Si la factura final es al menos $400 más alta que el estimado, puede iniciar una disputa dentro de 120 días desde la fecha de la factura."],
      },
      {
        h: "Cómo presentar una queja",
        p: ["Llame a la línea de ayuda de No Surprises (No Surprises Help Desk) al 1-800-985-3059 o presente su queja en línea ante CMS (Centers for Medicare & Medicaid Services, los Centros de Servicios de Medicare y Medicaid). Incluya la factura, su estado de cuenta del seguro y cualquier estimado que le hayan dado."],
      },
    ],
    faqs: [
      ["¿La No Surprises Act cubre las ambulancias terrestres?", "No. Las ambulancias aéreas están cubiertas, pero las facturas de ambulancias terrestres no, aunque algunos estados tienen sus propias protecciones."],
      ["¿Puede un médico pedirme que renuncie a mis protecciones de la No Surprises Act?", "Para cierta atención que no es de emergencia, los proveedores fuera de la red pueden pedir un consentimiento por escrito con anticipación. No pueden hacerlo en la atención de emergencia, ni en servicios como anestesia y radiología en un centro dentro de la red."],
    ],
    cta: "¿Recibió una factura sorpresa? Escanéela y la revisaremos.",
  },
  {
    slug: "how-to-get-your-security-deposit-back",
    title: "Cómo recuperar su depósito de garantía",
    description: "Su arrendador tiene un plazo para devolverle el depósito o explicar los descuentos. Así puede documentar la mudanza, enviar una carta de reclamo y llevar el caso a la corte de reclamos menores si hace falta.",
    intro: "Cada estado limita cuánto tiempo puede quedarse el arrendador con su depósito y por qué puede descontar. El desgaste normal por el uso por lo general no es un descuento válido.",
    blocks: [
      {
        h: "Paso a paso",
        steps: [
          ["Documente la mudanza", "Tome fotos y video con fecha de cada cuarto, y guarde su lista de revisión de cuando entró, si la tiene."],
          ["Dé una dirección de envío por escrito", "En muchos estados, el plazo del arrendador depende de eso. Envíela por correo electrónico o por correo postal y guarde una copia."],
          ["Conozca el plazo de su estado", "La mayoría de los estados dan a los arrendadores entre 14 y 60 días. Vea la tabla por estado en la versión en inglés de esta guía."],
          ["Envíe una carta de reclamo", "Si pasa el plazo o los descuentos parecen injustos, envíe una carta con fecha en la que pida la cantidad que se le debe dentro de 14 días."],
          ["Vaya a la corte de reclamos menores", "La corte de reclamos menores (small claims court) está hecha para personas sin abogado. Algunos estados le permiten recuperar una cantidad adicional si el depósito se retuvo de mala fe."],
        ],
      },
      {
        h: "Lo que los arrendadores por lo general no pueden descontar",
        list: [
          "El desgaste normal: pintura descolorida, un poco de desgaste en la alfombra, agujeros pequeños de clavos",
          "Una limpieza que vaya más allá de dejar la unidad en las condiciones en que usted la recibió",
          "Reparaciones de daños que ya estaban cuando usted se mudó",
          "Cargos sin una lista detallada, en los estados que la exigen",
        ],
      },
    ],
    faqs: [
      ["¿Cuánto tiempo tiene un arrendador para devolver un depósito de garantía?", "Depende del estado, por lo general entre 14 y 60 días después de la mudanza. Vea nuestra tabla por estado en la versión en inglés."],
      ["¿Qué hago si mi arrendador nunca me devolvió el depósito?", "Envíe un reclamo por escrito con un plazo. Si no paga, puede presentar su caso en la corte de reclamos menores, y algunos estados otorgan daños adicionales cuando el depósito se retiene de mala fe."],
    ],
    cta: "Cuéntenos de su depósito y le escribiremos la carta de reclamo.",
  },
  {
    slug: "how-to-demand-repairs-from-your-landlord",
    title: "Cómo exigir reparaciones a su arrendador, por escrito",
    description: "Su arrendador debe mantener su vivienda habitable. Así puede pedir las reparaciones para tener pruebas, cuánto tiempo es razonable esperar y qué hacer si lo ignoran.",
    intro: "Casi todos los estados exigen que el arrendador mantenga la vivienda segura y habitable: calefacción y agua que funcionen, cerraduras, sin goteras ni plagas, y cableado y plomería en buen estado. La forma en que usted lo pide importa tanto como el problema.",
    blocks: [
      {
        h: "Paso a paso",
        steps: [
          ["Póngalo por escrito", "Envíe una carta o un correo electrónico con fecha que diga cuál es el problema, en qué cuarto, desde cuándo y qué quiere que arreglen. Un mensaje de texto o una llamada son difíciles de probar después."],
          ["Guarde las pruebas", "Fotos y video con fecha, sus mensajes y los recibos de las cosas que el problema dañó."],
          ["Dé un plazo razonable", "Muchos estados esperan entre 14 y 30 días para reparaciones ordinarias, y mucho menos si no hay calefacción, no hay agua, la cerradura no funciona o hay olor a gas."],
          ["Envíe un segundo aviso", "Si no pasa nada, envíe un seguimiento corto por correo certificado que mencione la primera solicitud. Eso prepara lo que haga después."],
          ["Llame al inspector", "Reporte los problemas graves a la oficina de cumplimiento de códigos (code enforcement) de su ciudad o condado. Un informe escrito de inspección es una prueba sólida."],
          ["Elija su remedio con asesoría", "Según su estado, puede incluir reparar y descontar (repair and deduct), retener la renta, depositar la renta en custodia (rent escrow), terminar el contrato o demandar. Cada uno tiene pasos estrictos. Vea la página de su estado y llame a la ayuda legal antes de actuar."],
        ],
      },
      {
        h: "Protéjase",
        list: [
          "Siga pagando la renta, a menos que un abogado o las reglas de su estado le digan otra cosa. Retener la renta de la forma equivocada puede hacer que lo desalojen",
          "No arregle las cosas usted mismo para descontar el costo, a menos que su estado lo permita y usted haya seguido sus pasos de aviso",
          "Muchos estados prohíben las represalias. Un arrendador que le sube la renta, recorta servicios o inicia un desalojo poco después de que usted se queja puede estar violando la ley",
          "Deje entrar al arrendador con el aviso debido. Negar la entrada para hacer reparaciones puede perjudicar su caso",
        ],
      },
    ],
    faqs: [
      ["¿Qué se considera una reparación de emergencia?", "No tener calefacción cuando hace frío, no tener agua, una fuga de gas, una cerradura rota, un desborde de aguas negras o peligros eléctricos. Llame al arrendador de inmediato y luego confírmelo por escrito."],
      ["¿Puede mi arrendador desalojarme por pedir reparaciones?", "En la mayoría de los estados eso es una represalia ilegal, sobre todo poco después de una queja. Guarde sus registros y vea la página de su estado para saber cuánto dura la protección."],
      ["¿Qué pasa si el problema es moho?", "Documéntelo con fotos, repórtelo por escrito y pida que arreglen la causa, no que solo lo pinten encima. El moho causado por una fuga por lo general es una reparación a cargo del arrendador."],
    ],
    cta: "¿El arrendador no lo arregla? Le escribiremos la exigencia de reparación para su estado.",
  },
  {
    slug: "eviction-notices-explained",
    title: "Los avisos de desalojo explicados: qué significa cada uno y cuánto tiempo tiene",
    description: "Avisos de pagar o irse, de corregir o irse y sin culpa. Lo que un arrendador debe hacer antes de desalojarlo, lo que no puede hacer y qué hacer el día que reciba un aviso.",
    intro: "Un aviso de desalojo no es un desalojo. Es solo el primer paso. Por lo general, el arrendador tiene que darle un aviso, presentar un caso en la corte y ganarlo antes de que alguien pueda obligarlo a irse. Lo que haga en los primeros días es lo más importante.",
    blocks: [
      {
        h: "Los tipos principales de aviso",
        list: [
          "Pagar o irse (pay or quit): usted debe renta. Pague la cantidad completa antes del plazo, o múdese. Los plazos suelen ser de 3 a 14 días, según el estado.",
          "Corregir o irse (cure or quit): usted violó una regla del contrato, por ejemplo tener una mascota sin permiso. Corrija el problema antes del plazo para quedarse.",
          "Irse sin opción de corregir (unconditional quit): usted debe irse y corregir el problema no ayuda. Se usa en algunos estados para faltas graves o repetidas.",
          "Aviso sin culpa o de fin de contrato (no-fault): el arrendador está terminando un arrendamiento de mes a mes o no lo va a renovar. El aviso suele ser de 30 a 90 días, y algunos estados y ciudades exigen una razón.",
        ],
      },
      {
        h: "Lo que un arrendador no puede hacer",
        list: [
          "Cambiar sus cerraduras, quitar su puerta o sus pertenencias, o cortar los servicios para obligarlo a irse. En casi todos los estados eso es un desalojo ilegal por mano propia (\"self-help\")",
          "Desalojarlo sin pasar por la corte",
          "Desalojarlo como represalia por pedir una reparación o presentar una queja, ni por su raza, su situación familiar, su discapacidad u otra condición protegida",
        ],
      },
      {
        h: "El día que recibe un aviso",
        steps: [
          ["Léalo con cuidado", "Busque el tipo de aviso, la fecha en que se lo entregaron, el plazo y lo que dicen que usted debe o hizo."],
          ["No lo ignore", "Aunque piense mudarse, responda. Una sentencia de la corte puede aparecer en su historial de alquiler y en su informe de crédito."],
          ["Llame a la ayuda legal", "La ayuda legal gratuita es el mejor paso que puede dar. Muchos programas dan prioridad a las personas que enfrentan un desalojo. Elija su estado en nuestra página de ayuda legal."],
          ["Busque ayuda con la renta", "Llame al 211 o a la agencia de vivienda de su localidad. Algunos programas pagan la renta atrasada directamente al arrendador."],
          ["Reúna sus registros", "El contrato, los recibos de renta, los mensajes con el arrendador, las fotos de cualquier problema y el aviso mismo."],
          ["Responda a los papeles de la corte", "Si el arrendador presenta un caso, usted recibirá una citación (summons). El plazo para responder puede ser de solo unos pocos días. Vaya a la audiencia aunque no haya encontrado un abogado."],
        ],
      },
    ],
    faqs: [
      ["¿Cuánto tarda un desalojo?", "Desde el aviso hasta una orden de la corte puede tomar de unas semanas a unos meses, según el estado, la corte y si usted lo impugna. No cuente con retrasos."],
      ["¿Un desalojo queda en mi historial?", "Un caso en la corte puede aparecer en los informes de evaluación de inquilinos aunque usted gane o llegue a un acuerdo. Pregunte a la ayuda legal si puede sellarse el caso o negociar que lo desestimen."],
      ["¿Tengo que irme cuando termina el plazo del aviso?", "No. Solo una orden de la corte, ejecutada por el alguacil (sheriff o marshal), puede sacarlo. Pero si se presenta el caso, usted debe responder y presentarse."],
    ],
    cta: "¿Recibió un aviso? Se lo explicaremos y escribiremos su respuesta.",
  },
  {
    slug: "what-debt-collectors-cant-do",
    title: "Lo que los cobradores de deudas no pueden hacer: sus derechos bajo la ley federal",
    description: "Cuándo puede llamar un cobrador, lo que no puede decir y qué hacer si se pasa de la raya. Incluye cómo detener las llamadas y cómo demandar por violaciones.",
    intro: "La Fair Debt Collection Practices Act (Ley de Prácticas Justas de Cobro de Deudas, o FDCPA) y la Regulation F (Regulación F) de la CFPB (Consumer Financial Protection Bureau, la Oficina para la Protección Financiera del Consumidor) ponen reglas a los cobradores externos y a los compradores de deudas. Muchos cobradores las rompen. Conocer las reglas le da algo concreto a qué señalar.",
    blocks: [
      {
        h: "Llamadas y contacto",
        list: [
          "No pueden llamar antes de las 8 a.m. ni después de las 9 p.m. en su zona horaria",
          "Más de 7 llamadas en 7 días sobre la misma deuda se presume acoso",
          "Después de hablar con usted por teléfono, no pueden hacer una nueva llamada sobre esa deuda durante 7 días",
          "No pueden llamar a su trabajo si usted les dice que su empleador no lo permite",
          "Puede decirles por escrito que dejen de contactarlo, o que lo contacten solo de ciertas maneras. Entonces solo pueden contactarlo para confirmar que van a parar o para avisarle de una acción específica, como una demanda",
          "Los mensajes de texto y los correos electrónicos deben incluir una forma sencilla de dejar de recibirlos",
        ],
      },
      {
        h: "Lo que no pueden decir ni hacer",
        list: [
          "Amenazarlo con arresto, o amenazarlo con acciones legales que no piensan tomar o no pueden tomar",
          "Mentir sobre la cantidad, sobre quiénes son, o sobre si son abogados o trabajan para el gobierno",
          "Contarle su deuda a su familia, sus vecinos o su empleador. Solo pueden pedir a otras personas su información de contacto",
          "Usar lenguaje obsceno, o amenazarlo o acosarlo",
          "Agregar cargos, intereses o costos que el contrato o la ley no permiten",
          "Demandar o amenazar con demandar por una deuda que ya pasó el plazo legal",
          "Depositar antes de tiempo un cheque con fecha posterior, o tomar un pago que usted no aceptó",
        ],
      },
      {
        h: "A quiénes cubren estas reglas",
        p: ["Se aplican a los cobradores externos y a los compradores de deudas. En su mayoría no se aplican al acreedor original que cobra su propia deuda, aunque las leyes estatales muchas veces sí. Algunas leyes estatales son más estrictas que las federales."],
      },
      {
        h: "Si un cobrador rompe las reglas",
        steps: [
          ["Lleve un registro", "Anote la fecha, la hora, el número y lo que se dijo. Guarde los mensajes de voz, los textos, los correos y las cartas."],
          ["Dígales por escrito que paren", "Envíe una carta certificada que diga que dejen de contactarlo, o que lo contacten solo por escrito."],
          ["Presente quejas", "Repórtelos a la CFPB en consumerfinance.gov/complaint, a la FTC (Federal Trade Commission, la Comisión Federal de Comercio) y a la fiscalía general de su estado (state attorney general)."],
          ["Considere demandar", "Puede demandar en una corte federal o estatal dentro de un año de la violación. Si gana, la corte puede otorgarle hasta $1,000 más daños, costos de la corte y honorarios de abogado. Muchos abogados de consumidores toman estos casos sin cobrar por adelantado."],
        ],
      },
    ],
    faqs: [
      ["¿Puede un cobrador de deudas llamarme al trabajo?", "No si usted le dice que su empleador no lo permite, ni en horas inconvenientes, como antes de las 8 a.m. o después de las 9 p.m."],
      ["¿Pueden embargarme el sueldo sin demandarme?", "Por lo general no. Para la mayoría de las deudas de consumo, el cobrador necesita primero una sentencia de la corte. Los préstamos estudiantiles federales, los impuestos y la manutención de menores son excepciones."],
      ["¿Puedo hacer que dejen de llamar?", "Sí. Envíe una solicitud por escrito para que paren. Todavía pueden demandar, y la deuda sigue existiendo, pero deben detener las llamadas y las cartas."],
    ],
    cta: "¿Un cobrador se pasa de la raya? Le escribiremos la carta para que deje de contactarlo.",
  },
  {
    slug: "debt-validation-letter",
    title: "Validación de deuda: cómo hacer que un cobrador la demuestre",
    description: "Un cobrador de deudas tiene que demostrar que usted debe la deuda. Conozca su plazo de 30 días, lo que hace una solicitud de validación y lo que no debe decirle a un cobrador.",
    intro: "Las deudas se compran y se venden, y los registros se pierden. La ley federal le da derecho a hacer que un cobrador muestre qué está cobrando y por qué, antes de que usted pague nada.",
    blocks: [
      {
        h: "Paso a paso",
        steps: [
          ["Busque el aviso de validación", "Los cobradores deben enviar un aviso con la cantidad, el acreedor y sus derechos. Por lo general viene en la primera carta, o dentro de 5 días del primer contacto."],
          ["Dispute dentro de 30 días", "Si disputa por escrito dentro del plazo de 30 días que indica ese aviso, el cobrador debe dejar de cobrar hasta que le envíe la verificación."],
          ["Pida datos concretos", "Pida el acreedor original, un desglose de la cantidad y pruebas de que tienen derecho a cobrarla."],
          ["Revise el límite de tiempo", "Cada estado limita por cuánto tiempo se puede demandar por una deuda. Los cobradores no pueden demandar ni amenazar con demandar por una deuda que ya pasó ese límite."],
          ["Hágalo todo por escrito", "Envíe las cartas por correo certificado y anote cada llamada. También puede decirle por escrito al cobrador que deje de contactarlo."],
        ],
      },
      {
        h: "Lo que no debe hacer",
        list: [
          "No confirme por teléfono que la deuda es suya",
          "No haga un pago pequeño para que paren las llamadas. En una deuda vieja, en algunos estados eso puede reiniciar el límite de tiempo",
          "No dé datos de su banco o su tarjeta a un cobrador que no ha verificado",
          "No ignore los papeles de la corte. Si lo demandan, responda antes del plazo y busque ayuda legal",
        ],
      },
      {
        h: "Dónde quejarse",
        p: ["Reporte a los cobradores que rompan las reglas ante la Consumer Financial Protection Bureau (Oficina para la Protección Financiera del Consumidor, o CFPB), la FTC (Federal Trade Commission, la Comisión Federal de Comercio) y la fiscalía general de su estado (state attorney general)."],
      },
    ],
    faqs: [
      ["¿Qué es una carta de validación de deuda?", "Es una solicitud por escrito para que un cobrador demuestre la deuda: quién es el acreedor original, cuánto se debe y que tiene derecho a cobrarla. Si se envía dentro del período de validación de 30 días, detiene el cobro hasta que respondan."],
      ["¿Qué pasa si nunca validan la deuda?", "No deberían seguir cobrando hasta que lo hagan. Si siguen, puede presentar una queja ante la CFPB y la fiscalía general de su estado."],
    ],
    cta: "¿Recibió una carta de cobro? Le escribiremos la solicitud de validación.",
  },
  {
    slug: "hospital-financial-assistance-charity-care",
    title: "Ayuda financiera de los hospitales (charity care): cómo solicitarla",
    description: "Los hospitales sin fines de lucro deben tener una política de ayuda financiera. Conozca quién califica, qué no puede hacer el hospital mientras usted solicita y cómo pedirla.",
    intro: "La mayoría de los hospitales de EE. UU. son organizaciones sin fines de lucro, y las reglas de impuestos federales les exigen ayudar a las personas que no pueden pagar sus facturas. Muchos pacientes nunca la piden. Pedirla no cuesta nada, y la respuesta puede reducir mucho una factura o borrarla.",
    blocks: [
      {
        h: "Lo que deben hacer los hospitales sin fines de lucro",
        list: [
          "Tener una política escrita de ayuda financiera y hacerla fácil de encontrar en el sitio web del hospital",
          "Ofrecer un resumen en lenguaje sencillo y un formulario de solicitud",
          "Limitar lo que cobran a los pacientes que califican a más o menos lo que pagan las aseguradoras, no el precio de lista completo",
          "Esperar al menos 120 días después de la primera factura antes de enviarlo a cobranza, reportarlo a las agencias de crédito, demandarlo o tomar otras medidas de cobro serias",
          "Revisar si usted califica antes de tomar esas medidas",
          "Aceptar solicitudes durante al menos 240 días después de la primera factura",
        ],
      },
      {
        h: "Paso a paso",
        steps: [
          ["Pida la política y la solicitud", "Llame a la oficina de facturación y diga: \"Quisiera solicitar ayuda financiera\" (\"I'd like to apply for financial assistance\"). También busque en el sitio web del hospital \"financial assistance\" o \"charity care\"."],
          ["Revise los límites de ingresos", "Los hospitales por lo general fijan la elegibilidad como un múltiplo del nivel federal de pobreza. Algunos ayudan a personas con el 400% del nivel de pobreza o más. Muchos dan atención gratuita a los ingresos más bajos y descuentos por encima de eso."],
          ["Reúna sus comprobantes", "Talones de pago, la declaración de impuestos del año pasado, cartas de beneficios, o una carta que explique que no tiene ingresos. Algunos hospitales aceptan una declaración firmada."],
          ["Solicite aunque no esté seguro", "Las reglas son distintas y algunos hospitales cuentan los bienes y otros no. Deje que ellos decidan."],
          ["Pida que pongan la cuenta en pausa", "Pida por escrito que la cuenta se pause mientras revisan su solicitud, y guarde una copia."],
          ["Apele si le niegan la ayuda", "Pida el motivo por escrito y pregunte si puede volver a solicitar con más información o pedir una revisión."],
        ],
      },
      {
        h: "Facturas que ya pagó",
        p: ["Si pagó una factura y después se entera de que habría calificado, pregunte al hospital si revisará la cuenta y le devolverá la diferencia. Algunos lo harán, sobre todo si todavía estaba dentro del plazo para solicitar."],
      },
    ],
    faqs: [
      ["¿La ayuda financiera afecta mi crédito?", "Solicitarla no lo afecta. Mientras su solicitud está pendiente, un hospital sin fines de lucro por lo general no puede reportar la deuda a las agencias de crédito ni demandarlo."],
      ["¿Qué pasa si mi hospital tiene fines de lucro o es del gobierno?", "La regla federal se aplica a los hospitales sin fines de lucro. Muchos hospitales con fines de lucro y públicos igual tienen programas, y algunos estados se los exigen. Pida la política y revise la página de su estado."],
      ["¿Tengo que estar sin seguro?", "No. Muchas políticas también ayudan a pacientes con seguro con sus deducibles y coseguros. Pregunte qué cubre la política."],
    ],
    cta: "Le ayudaremos a escribir la solicitud de ayuda financiera.",
  },
];
