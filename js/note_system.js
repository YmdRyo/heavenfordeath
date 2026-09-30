const CORRECT_PIN = "8190";
let currentNoteStep = 0;
let noteAudio = null;
let musicStarted = false;

let typewriterTimer = null;
let isTyping = false;
let currentFullText = "";
let fadeInterval = null;
let noteKeyBlocker = null;

const IMG_BASE = "img/note/";
const IMG_1 = IMG_BASE + "note_1.png";
const IMG_2 = IMG_BASE + "note_2.png";
const IMG_3 = IMG_BASE + "note_3.png";

const NOTE_DATA = {
    'es': [
        { img: null, text: `Carta de Suicidio

Si estás leyendo esta carta, significa que ya no estoy en este mundo, ¿verdad?
Si te preguntas dónde estoy, probablemente esté en el Infierno.` },
        
        { img: IMG_1, text: `Si me preguntasen el por qué decidí terminar con mi vida,
seguramente respondería así:

“Estoy cansada. Todo es aburrido.”

Nada más.` },
        { img: IMG_1, text: `Para todos mis asesores, por favor sepan que le pasaré
todos mis ahorros a mi amiga Ikuyo Kita.
Dejé su información de contacto al final.
Si eso no es suficiente, pónganse en contacto
con mis padres.` },
        { img: IMG_1, text: `Mamá, papá, lo siento.
En estos 23 años, he sido una hija terrible.
La manera en la que me sobreprotegían me molestaba…` },
        { img: IMG_1, text: `Así que decidí aprender a tocar el bajo,
que estaba en un manga que me recomendaron,
como manera de rebelarme.
El empezar a tocar el bajo, unirme a una banda y dejar la universidad,
esos, al final, no eran más que caprichos míos.` },
        { img: IMG_1, text: `... No puedo cambiar el pasado, así que no entraré en detalle.
En primer lugar, no estaba decepcionada con mi vida.
Aunque estaba inundada en deudas por los últimos 2 o 3 años,
estaba satisfecha.` },
        { img: IMG_1, text: `Pero hay una cosa más.

Hay algo que simplemente no puedo entender
sin importar cuánto lo intente, así que lo escribiré aquí.
Esto es algo que nunca le conté a nadie,
así que no estoy esperando encontrar una respuesta.` },
        { img: IMG_1, text: `Yo simplemente… pensé que lo podría dejar aquí,
como prueba de que pasó.` },
        { img: IMG_1, text: `En una noche cuando tenía 19 años…
Recuerdo que estaba lloviendo fuertemente.
Estaba bebiendo alcohol, o quizás no, la verdad no lo recuerdo.
Lo que recuerdo es que estaba enfrente de la casa de Seika Ijichi,
llevando cosas para una pijamada, cuando de la nada empecé a llorar.` },
        { img: IMG_1, text: `Seika Ijichi es la dueña del local de música STARRY.
La banda de la que solía ser parte, “Kessoku Band”,
tocaba ahí a menudo.
Después de salirme de la banda, no la he visto ni una sola vez,
y realmente no éramos tan cercanas antes de eso.` },
        { img: IMG_1, text: `No importara lo que hiciera, no entendía:

   1. ¿Cómo sabía dónde vivía?
   2. ¿Por qué preparé cosas para quedarme en su casa?
   3. ¿Por qué estaba llorando?` },
        { img: IMG_1, text: `Después de que ella me llevara de vuelta a mi casa
en medio de mi confusión, intenté recordar lo que había pasado.
No importara cuánto lo intentara, no podía recordar.` },

        { img: IMG_2, text: `Mi vida después de eso, para mí, fue miserable.
Mis recuerdos habían sido borrados como palabras escritas en la arena.
No importase cuán profundo las palabras estuviesen talladas en la arena,
tan pronto las olas llegaran, no quedaría rastro.` },
        { img: IMG_2, text: `Quizás suene loco…
pero de lo que puedo recordar de mi adolescencia…
siento como si hubiese alguien más, como si alguien más hubiese existido.
Y en ese día, en el año decimonoveno de mi vida,
esa persona desapareció… eso es lo que creía.` },
        { img: IMG_2, text: `Hablando de eso, Bocchi… Hitori Gotoh
puede que haya enloquecido a inicios de ese año.

De verdad, perdónenme por llevármela de este mundo conmigo.
Esta también fue una decisión que yo misma tomé.` },
        { img: IMG_2, text: `No podía aguantar seguir viendo a Bocchi de esa manera…

Bocchi ya parecía como si estuviese muerta.
A este punto, aunque si ella continuase viviendo,
nada cambiaría, ¿verdad?
Eso fue lo que pensé.` },
        { img: IMG_2, text: `Todos los días, ella no dejaba de buscar a una amiga imaginaria,
también era agresiva hacia la baterista de Kessoku Band,
y siempre discutía fuertemente con Ikuyo…` },
        { img: IMG_2, text: `Bocchi dejó de subirse al escenario,
lo que era básicamente su razón para vivir.
Hasta cerró su cuenta de Guitar Hero.
Esta no era Bocchi, o al menos, no era la Bocchi que yo conocía.` },
        { img: IMG_2, text: `En este punto, temía lo que pudiera terminar siendo Bocchi.
Es por eso que le di un ticket para que me acompañara al más allá.

..... Y lo que pasó después, todos ya deberían de saberlo.` },
        { img: IMG_3, text: `En mi vida, he mentido varias veces.
Probablemente nunca he dicho nada sincero.
Pero aun así, la última cosa que quiero decir es:
“Lo siento.”

Para mí, para todos, estas palabras realmente provienen de mi ser.` },
        { img: IMG_3, text: `Y con eso, termino aquí.
No quiero que me recuerden en el pasado,
tampoco deseo renacer.` },

        { img: IMG_3, text: `Terminaré dando las palabras de un poeta chino, Sū Shì:

         “La vida es un viaje.
          Y yo, solamente vengo de paso.”` },

        { img: null, text: `Y al final, no soy más que otro humano aburrido.
Adiós.

Atentamente, Ryo Yamada
Algún año, algún mes, algún día.
En mi casa.` }
    ],

    'en': [
        { img: null, text: `Suicide Note

If you are reading this letter, then I am no longer in this world, am I? 
If you're asking where I am, I believe that I am surely in Hell.` },

        { img: IMG_1, text: `If you were to ask me why I chose to end my life,
this is how I would answer:

"I'm tired. Everything is boring."

That's all.` },
        { img: IMG_1, text: `To all my creditors, please let them know that I have passed
all my savings to my friend Kita Ikuyo.
I have written her contact information at the end.
If this is still not enough, please contact my parents.` },
        { img: IMG_1, text: `Mama, Papa, I'm sorry.
In these 23 years, I have been a bad daughter. 
Your excessive helicoptering was troublesome...
So I decided to learn how to play the bass that was
in the manga that my friend recommended me.` },
        { img: IMG_1, text: `Picking up the bass, joining a band, and dropping out of university,
all of these things were just my whims.` },
        { img: IMG_1, text: `... I can't change the past, so I won't talk about it much.
In the first place, I wasn't disappointed with my life.
Even though I was buried in debt for these past 2 to 3 years, 
I was satisfied.` },
        { img: IMG_1, text: `There's just one thing. 

There's something that I just can't understand no matter what I do,
so I’ll write it down here.
This is something that I've never told anyone about,
so I’m not thinking about finding the answer to it.` },
        { img: IMG_1, text: `It's just... I thought that I wanted to leave a record and write about it.` },
        { img: IMG_1, text: `There was a night when I was 19 years old....
I remember that it was pouring rain,
but whether I was drinking alcohol or not, I don't remember.
What I remember was standing in front of Ijichi Seika’s house
carrying stuff for a sleepover, and when all of the sudden, 
I started crying.` },
        { img: IMG_1, text: `Ijichi Seika is the owner of the livehouse STARRY.
The band I used to be part of, “Kessoku Band”, used to perform there a lot.
After I quit the band, I hadn’t met her once,
and before that I wasn’t really that close to her either.` },
        { img: IMG_1, text: `No matter what I did, I couldn't understand.

   1. Why did I know where she lived?
   2. Why had I prepared to stay over at her place?
   3. Why was I crying?` },
        { img: IMG_1, text: `After she took me all the way back home in my state of confusion,
I frantically tried to remember what had happened.
But no matter what I did, I couldn't remember.` },

        { img: IMG_2, text: `My life after that, to me, was miserable.
My memories had been erased like the words written on a sandy beach.
No matter how deeply the words were carved into the floor,
eventually the waves would crash, leaving not even a trace.` },
        { img: IMG_2, text: `This might be some crazy thinking...
But in my hazy memories as a student, I... 
I felt like there was someone that existed there.
And so on that day in my 19th year of life, that person disappeared...
is what I thought.` },
        { img: IMG_2, text: `Speaking of which, Bocchi...
Gotou Hitori may have gone crazy starting from that year.

Please forgive me for taking her from this world along with me.
This is also just a decision I made on my own.` },
        { img: IMG_2, text: `I couldn’t stand seeing Bocchi looking like a husk......
Bocchi already seemed like she was dead.
At this rate, even if she were to continue living,
nothing would change for her, would it?
....That was what I believed.` },
        { img: IMG_2, text: `Everyday, she chased after an invisible imaginary friend,
showed strange aggression towards Kessoku Band’s drummer,
and was always terribly and irrationally arguing with Ikuyo....` },
        { img: IMG_2, text: `She stopped standing on the stage, which had been her reason for living.
She even closed her Guitar Hero account. 
This wasn’t Bocchi, or at least, this wasn’t the Bocchi that I knew.` },
        { img: IMG_2, text: `At this rate, I feared what would become of Bocchi.
That was why, I gave her a ticket to journey with me to the afterlife.

..... And what happened after that, everyone should know what went down.` },
        { img: IMG_3, text: `In my lifetime, I have made a lot of lies.
I've probably never said anything sincere.
But even so, the last thing I wish to say is, “I’m sorry.”
To myself, to everyone, these words are my true thoughts.` },
        { img: IMG_3, text: `And with that, I end it here.
I don’t wish for things like everyone to remember the past for me, 
or for me to be reborn again.` },

        { img: IMG_3, text: `I will end with the words of a Chinese poet, Sū Shì:
         “   Life is but a journey. 
            I, too, am only a passerby. ”` },

        { img: null, text: `And in the end, I am just another boring human.
Goodbye.

Yamada Ryou 
Reiwa Some Year, Some Month, Some Day. 
In my house.` }
    ],

    'pt': [
        { img: null, text: `Carta de Suicídio

Se você está lendo esta carta, então eu já não estou mais neste mundo, estou?
Se está se perguntando onde estou, acredito que com certeza estou no Inferno.` },

        { img: IMG_1, text: `Se você me perguntasse por que escolhi tirar minha própria vida,
é assim que eu responderia:

"Estou cansada. Tudo é entediante."

Isso é tudo.` },
        { img: IMG_1, text: `A todos os meus credores, por favor, informem-nos de que passei
todas as minhas economias para a minha amiga Kita Ikuyo.
Escrevi as informações de contato dela no final.
Se isso ainda não for suficiente, por favor, entrem em contato
com meus pais.` },
        { img: IMG_1, text: `Mamãe, Papai, me desculpem.
Nestes 23 anos, fui uma péssima filha.
O controle excessivo de vocês era incômodo...` },
        { img: IMG_1, text: `Por isso, decidi aprender a tocar o baixo que estava no mangá
que minha amiga me recomendou.
Começar a tocar baixo, entrar em uma banda e largar a faculdade,
todas essas coisas foram apenas caprichos meus.` },
        { img: IMG_1, text: `... Não posso mudar o passado, então não vou falar muito sobre isso.
Em primeiro lugar, eu não estava deceicinada com a minha vida.
Mesmo estando atolada em dívidas nestes últimos 2 ou 3 anos,
eu estava satisfeita.` },
        { img: IMG_1, text: `Há apenas uma coisa.

Existe algo que simplesmente não consigo entender,
não importa o que eu faça, então vou deixar registrado aqui.
Isso é algo sobre o qual nunca contei a ninguém,
por isso não estou pensando em encontrar uma resposta.` },
        { img: IMG_1, text: `É só que... achei que queria deixar um registro e escrever sobre isso.` },
        { img: IMG_1, text: `Houve uma noite, quando eu tinha 19 anos....
Lembro-me de que estava chovendo a cântaros,
mas se eu estava bebendo álcool ou não, não me lembro.
O que me lembro era de estar em pé em frente à casa de Ijichi Seika
carregando coisas para dormir lá, e quando, de repente,
comecei a chorar.` },
        { img: IMG_1, text: `Ijichi Seika é a proprietária da casa de shows STARRY.
A banda da qual eu fazia parte, "Kessoku Band", costumava tocar muito lá.
Depois que saí da banda, não a vi nenhuma vez e, antes disso,
eu realmente não era tão próxima dela.` },
        { img: IMG_1, text: `Não importa o que eu fizesse, não conseguia entender.

   1. Por que eu sabia onde ela morava?
   2. Por que eu tinha me preparado para dormir na casa dela?
   3. Por que eu estava chorando?` },
        { img: IMG_1, text: `Depois que ela me levou de volta para casa no meu estado de confusão,
tentei desesperadamente me lembrar do que havia acontecido.
Mas não importa o que eu fizesse, não conseguia me lembrar.` },

        { img: IMG_2, text: `Minha vida depois disso, para mim, foi miserável.
Minhas memórias haviam sido apagadas como palavras escritas em uma praia.
Não importa quão profundamente as palavras fossem esculpidas no chão,
eventualmente as ondas quebrariam, não deixando nem mesmo um traço.` },
        { img: IMG_2, text: `Isso pode ser um pensamento louco...
Mas nas minhas memórias confusas dos tempos de estudante, eu...
eu sentia que havia alguém que existia ali.
E assim, naquele dia no meu 19º ano de vida, essa pessoa desapareceu...
foi o que pensei.` },
        { img: IMG_2, text: `Falando nisso, a Bocchi...
Gotou Hitori pode ter enlouquecido a partir daquele ano.

Por favor, perdoem-me por tirá-la deste mundo junto comigo.
Esta também foi apenas uma decisão que tomei por conta própria.` },
        { img: IMG_2, text: `Eu não suportava ver a Bocchi parecendo uma casca vazia......
A Bocchi já parecia estar morta.
Nesse ritmo, mesmo que ela continuasse vivendo,
nada mudaria para ela, mudaria?
....Era nisso que eu acreditava.` },
        { img: IMG_2, text: `Todos os dias, ela perseguia uma amiga imaginária invisível,
demonstrava uma agressividade estranha em relação à baterista
da Kessoku Band e estava sempre discutindo terrivelmente
e sem razão com a Ikuyo....` },
        { img: IMG_2, text: `Ela parou de subir ao palco, que tinha sido sua razão de viver.
Ela até fechou sua conta de Guitar Hero.
Essa não era a Bocchi, ou pelo menos, não era a Bocchi que eu conhecia.` },
        { img: IMG_2, text: `Nesse ritmo, eu temia o que seria da Bocchi.
Foi por isso que lhe dei uma passagem para viajar comigo
para o outro mundo.

..... E o que aconteceu depois disso, todos devem saber como terminou.` },
        { img: IMG_3, text: `Durante a minha vida, contei muitas mentiras.
Provavelmente nunca disse nada sincero.
Mas, mesmo assim, a última coisa que desejo dizer é: "Sinto muito."
Para mim mesma, para todos, estas palavras são meus
sentimentos verdadeiros.` },
        { img: IMG_3, text: `E com isso, encerro aqui.
Não desejo coisas como que todos se lembrem do passado por mim,
ou renascer novamente.` },

        { img: IMG_3, text: `Vou terminar com as palavras de um poeta chinês, Sū Shì:
         "   A vida não passa de uma jornada.
            Eu também sou apenas um transeunte. "` },

        { img: null, text: `E, no final, sou apenas mais um ser humano entediante.
Adeus.

Yamada Ryou
Ano tal da Era Reiwa, Mês tal, Dia tal.
Na minha casa.` }
    ],

    'jp': [
        { img: null, text: `遺書

あなたがこの手紙を読む頃には
私はもうこの世にいないでしょう
どこにいるかと言えば、当然私は地獄だと思います` },

        { img: IMG_1, text: `なぜ私が人生を終わらせることを選んだのかと
聞かれたら、こう答えます
「疲れた 何もかもうんざりだ」
これですべてです` },
        { img: IMG_1, text: `債権者の皆々様には、私の唯一の貯金は友人の喜多郁代に
渡したと伝えてください 連絡先は最後に書きました
それでも足りなければ私の両親に連絡してください` },
        { img: IMG_1, text: `ママ、パパ ごめんなさい
２３年間、私は悪い娘でした` },
        { img: IMG_1, text: `二人の過干渉がうっとうしくて……私は友人に
勧められたマンガに載ってたベースを学びました
ベースを始めたことも、バンドを組んだことも、
芳大を中退したことも、すべては私の気まぐれです` },
        { img: IMG_1, text: `……過去は変えられないので、多くは語りません
そもそも私の人生に不満はありません
この２～３年間は借金まみれでしたが
それすらも私は満足しています` },
        { img: IMG_1, text: `一つだけ、どうしても理解できないことがあるので
ここに書き留めておきます これは誰にも言ったことがないし
答えが見つかるとも思っていません
ただ……記録を残したいと思って書いています` },
        { img: IMG_1, text: `私が１９歳のときのある夜……
その日は大雨だったことは覚えていますが
お酒を飲んでいたかどうかなどの詳細は覚えていません` },
        { img: IMG_1, text: `私が覚えているのは、伊地知星歌の家の前で
お泊まりセットを持った私が突然涙を流したこと……` },
        { img: IMG_1, text: `伊地知星歌はライブハウスＳＴＡＲＲＹの店長です
私の以前所属していたバンド
『結束バンド』はよくそこでライブをしていました` },
        { img: IMG_1, text: `バンドを辞めてからは
一度も会うことはありませんでしたし
それ以前も特に親しかったわけではありません` },
        { img: IMG_1, text: `私にはどうしてもわかりません
１、なぜ私は彼女の自宅を知っていたのか？
２、なぜ私は彼女の自宅へ泊まる支度をして行ったのか？
３、どうして私は泣いていたのか？` },
        { img: IMG_1, text: `混乱したまま彼女に私の家まで送ってもらった後
私は必死に何があったのか思い出そうとしました
ですが、どうしても思い出せなかった……` },

        { img: IMG_2, text: `それからの人生は、私にとってさんざんなものでした
記憶とは、砂浜に書いた文字と同じようなものです
どんなに深く書こうとも、やがて打ち寄せる波が
跡形もなく消し去ってしまうように` },
        { img: IMG_2, text: `あまりにバカバカしい考えですが……
学生時代のおぼろげな記憶では
どうも私は……
誰かに依存して生きていたような気がするのです` },
        { img: IMG_2, text: `そして１９歳のあの日から
この人がいなくなってしまったのではないか……と` },
        { img: IMG_2, text: `そう言えば、ぼっち……
後藤ひとりがおかしくなったのもこの年からでした

彼女を連れてこの世界から消えてしまったことを
許してください これも私の勝手な独断です` },
        { img: IMG_2, text: `私には、抜け殻のようになったぼっちを
見ているのは耐えられなかった……` },
        { img: IMG_2, text: `ぼっちはすでに死んでいるようなものでした
このまま生きていても bankrupt それは変わらないのでは？
……と私は思ってしまったのです` },
        { img: IMG_2, text: `毎日いもしないイマジナリーフレンドを追いかけ
私たち結束バンドのドラマーに異常な攻撃性を示し
いつも不機嫌で、理不尽で、郁代ともケンカしてばかりで……` },
        { img: IMG_2, text: `ステージに立つことも辞め、彼女の生き甲斐だった
ギターヒーローのアカウントも非公開にしてしまった
こんなのはぼっちじゃない、
少なくとも私の知ってるぼっちじゃない` },
        { img: IMG_2, text: `ぼっちをこのままにしたら
彼女がどうなってしまうのか私には恐ろしかった
だから私は、彼女に死出の旅への切符を差し出したのです

……その後どうなったかは、皆さんもご知の通りです` },
        { img: IMG_3, text: `私は人生で多くの嘘をついてきました
誠実だったことなどほとんどなかったかもしれません
それでも最後に言いたいのは「ごめんなさい」と言うことです
自分にも、そして皆にも この文だけは本心です` },
        { img: IMG_3, text: `と言うわけで、以上です
私は皆さんに過去を思い出してもらったり
自分が生まれ変わることなどを望んだりはしません` },

        { img: IMG_3, text: `中国の詩人 蘇軾(そしょく)の言葉を引用して終わります
『人生は逆旅(げきりょ)の如し、
 我もまた行人(こうじん)なり』` },

        { img: null, text: `結局のところ、私はただのつまらない人間でした
……さようなら

山田リョウ
令和某年某月某日 自宅にて` }
    ],

    'ru': [
        { img: null, text: `Предсмертная записка
Если вы читаете эту записку, то вероятно, 
что меня больше нет в этом мире. 
Если вы спросите где я, то я более чем уверена, 
что в Аду.` },

        { img: IMG_1, text: `Если вы хотите спросить, почему я захотела 
покончить с собой, то ответ прост:
"Я устала. Ничто не приносит удовольствия."
Как-то так.` },
        { img: IMG_1, text: `Всем моим кредиторам, пожалуйста, сообщите, 
что я передала все свои сбережения своей подруге 
Ките Икуйо. В конце я указала её номер. Если этого
недостаточно, прошу, свяжитесь с моими родителями.` },
        { img: IMG_1, text: `Мама, папа, простите. 
Все эти 23 года я была плохой дочерью.
Ваша забота всегда была чрезмерной...` },
        { img: IMG_1, text: `Поэтому я решила научиться играть на бас-гитаре, 
которая была в манге, которую мне посоветовал друг.
Взяла в руки бас, вступила в группу, 
бросила университет - всё это было лишь  
моими прихотями.` },
        { img: IMG_1, text: `... Я не могу изменить прошлое, поэтому не буду 
много говорить о нём. Прежде всего, я не 
разочарована своей жизнью. Даже несмотря на то, что
последние 2-3 года я утопала в долгах, я довольна.` },
        { img: IMG_1, text: `Но есть одна вещь.   
То, чего я никак не могу понять, 
что бы я ни делала, поэтому я напишу об этом здесь.
Это то, о чём я никогда никому не рассказывала, 
поэтому я не думаю о том, чтобы найти на это ответ.` },
        { img: IMG_1, text: `Просто... Я подумала, что хочу написать об этом.` },
        { img: IMG_1, text: `Ночью, когда мне было 19 лет... Я помню, что шёл 
дождь, но пила ли я в тот день или нет, 
я не помню.
Что я помню, так это то, что я стояла 
перед домом Иджичи Сэйки, держа вещи для ночёвки, 
и вдруг, я начала плакать.` },
        { img: IMG_1, text: `Иджичи Сейка - управляющая лайв-хауса "СТАРРИ". 
Группа "Жгут", в которой я раньше состояла,  
часто выступала там.
После ухода из группы я не встречалась с ней ни
разу. Да и до этого я не была с ней близка.` },
        { img: IMG_1, text: `Что бы я ни делала, я не могла понять. 
   1. Почему я знала, где она живёт? 
   2. Почему я шла к ней на ночёвку? 
   3. Почему я плакала?` },
        { img: IMG_1, text: `После того как она отвезла меня обратно домой, 
я в растерянности пыталась вспомнить, что произошло.  
Но что бы я ни делала, я не могла вспомнить.` },

        { img: IMG_2, text: `Моя жизнь после этого была для меня жалкой. 
Мои воспоминания были стёрты, как слова, написанные  
на песчаном пляже.
Неважно, насколько глубоко слова были высечены 
на песке, в конце концов волны 
смывают их, не оставляя и следа.` },
        { img: IMG_2, text: `Возможно, это безумные мысли... Но в своих смутных
воспоминаниях, когда я была студенткой, я...  
я чувствовала, что там кто-то есть, кого я забыла.
И вот, в тот день на 19-м году жизни, 
этот человек исчез... вот, что я подумала.` },
        { img: IMG_2, text: `Кстати говоря, Боччи... Гото Хитори, возможно,
сошла с ума, начиная с того года.

Пожалуйста, простите меня за то, что я забираю её
из этого мира вместе с собой. Это решение,
которое я приняла сама.` },
        { img: IMG_2, text: `Мне было невыносимо видеть Боччи,
похожую на ходячий труп...

Боччи уже выглядела так, как будто она давно мертва.
При таком раскладе, даже если бы она продолжила жить,
ничего бы не изменилось для неё, не так ли?..
Именно в это я и верила.` },
        { img: IMG_2, text: `Каждый день она гонялась за своим воображаемым 
другом, проявляла странную агрессию по отношению к  
барабанщице группы, и постоянно спорила с Икуйо...` },
        { img: IMG_2, text: `Она перестала выходить на сцену, которая была 
для неё смыслом жизни. Она даже удалила свой 
аккаунт "guitarhero". Это была не Боччи, или, по 
крайней мере, не та Боччи, которую я знала.` },
        { img: IMG_2, text: `Я боялась, что будет с Боччи.
Поэтому я дала ей билет, чтобы она отправилась
со мной в загробный мир.

... А что случилось потом, должен знать каждый.` },
        { img: IMG_3, text: `За свою жизнь я много лгала.
Наверное, я никогда не говорила ничего искреннего.
Но даже если так, последнее, что я хочу сказать, -
это "простите".
Себе, всем. Эти слова - мои истинные мысли.` },
        { img: IMG_3, text: `И на этом я заканчиваю.
Я не желаю, чтобы все вспоминали меня,
или чтобы я воскресла.` },

        { img: IMG_3, text: `Я закончу словами китайского поэта Су Ши: 
         "Жизнь - это всего лишь путешествие.  
          Я в ней всего лишь прохожий."` },

        { img: null, text: `В конце концов, я всего лишь очередной скучный человек.
Прощайте.

Ямада Рё,
какой-то день, какой-то месяц, какой-то год 
эпохи Рэйва.` }
    ],

    'cn': [
        { img: null, text: `当你看到这封信时，我大概已经不在此处了。
至于去哪里，我想，只有地狱才适合我这样的罪人。` },

        { img: IMG_1, text: `如果你问我为什么要选择结束自己的生命，
我只能告诉你，我累了，我对一切都感到厌倦，
仅此而已。` },
        { img: IMG_1, text: `请帮忙告诉债主（们），我仅有的积蓄都已交付给友人郁代，
她的联系方式写在末尾。
如果不够偿还，还请联系我的父母。` },
        { img: IMG_1, text: `父亲、母亲，非常抱歉……在死后还要给你们添麻烦。
在我短暂的二十三年人生里，我并没有做一个好女儿。
我不想成为一个温顺的人……
少时的叛逆驱使我学习贝斯，并疏远了你们。` },
        { img: IMG_1, text: `我并不后悔我所做的一切选择，包括学贝斯、
包括玩乐队、包括从东大退学……
也包括最后我任性的决定。` },
        { img: IMG_1, text: `……往者不可追，我不再过多赘述。
我对我的人生没有怨言，不如说这两三年“纸醉金迷”的生活，
才是我所满意的。` },
        { img: IMG_1, text: `仅有一件事，我至今仍是不解，故在信中写下。
我从未向任何人提起过这件事情，也不奢求能找到答案，
写下也只是……想留下点什么。` },
        { img: IMG_1, text: `那是我19岁时的某一天深夜，
我记得很清楚那天下着大雨。
至于那天是否喝了酒及其他细节，倒是不记得了。` },
        { img: IMG_1, text: `当我有意识时，我站在伊地知星歌家的门口，
手上还拿着过夜用的物品，泪流满面。` },
        { img: IMG_1, text: `伊地知星歌是下北泽live house【繁星】的店长，
我曾经所在的乐队【结束乐队】在繁星表演过一段时间，
来店期间我与店长有过短暂的交流，除此之外再无交集。` },
        { img: IMG_1, text: `我实在是太过不解：
1、我为何知道她家地址；
2、我为何出现在她家门口；
3、又在为何流泪？` },
        { img: IMG_1, text: `在狼狈地被赶回家后，我试着去回想……
却发现无论如何都回忆不出缘由。` },

        { img: IMG_2, text: `总之、那一年，我很混乱，
记忆中的很多事情就好像沙滩上的字迹，
哪怕我写得再深，潮水过后照样无影无踪。` },
        { img: IMG_2, text: `说来这有点荒谬，但在我模糊的校园时期印象里，
我似乎是……依靠着【某人】而生活下去的。
而从19岁的某一天开始，这个人不在了。` },
        { img: IMG_2, text: `现在想来，波奇……后藤好像也是在那一年变得不正常。

请原谅我带着后藤一起消失于人世，这是我任性的决定。
我实在看不下去她那浑浑噩噩的样子，
 decentralized 这样和死去有什么区别？` },
        { img: IMG_2, text: `每天找寻着她的幻想朋友，
对我们乐队的鼓手表现出极强的攻击性。
喜怒无常、说话没有逻辑，
不再上台表演，也不再运营吉他英雄的账号。` },
        { img: IMG_2, text: `这不是波奇，至少、不是我认识的波奇。

我无法想象这样下去她会变成什么样子，
所以，我自作主张地向她发出了邀请。

之后要发生的事情你们也都知道了。` },
        { img: IMG_3, text: `我这一生说过很多谎，不如说根本没有多少真诚的时刻。
……但在最后还是想说：很抱歉。对自己，也对所有人。
无论如何，这一句是真心的。` },
        { img: IMG_3, text: `那么、言尽于此吧。
我不追忆过往，也不奢求来世。` },

        { img: IMG_3, text: `我亦是行人。` },

        { img: null, text: `山田凉
令和某月某日 于家中` }
    ]
};

window.openPinModal = function() {
    disableGameInput();

    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
        pinInput.onkeydown = function(e) {
            e.stopPropagation();
        };
    }
    document.getElementById('pinError').style.display = 'none';
    document.getElementById('pinModal').style.display = 'flex';
};

window.closePinModal = function() {
    document.getElementById('pinModal').style.display = 'none';
    enableGameInput();
};

window.validatePin = function() {
    const inputPin = document.getElementById('pinInput').value;
    if (inputPin === CORRECT_PIN) {
        document.getElementById('pinModal').style.display = 'none';
        startNoteViewer();
    } else {
        document.getElementById('pinError').style.display = 'block';
    }
};

function getCurrentLang() {
    let lang = null;

    if (window.currentLanguage) {
        lang = window.currentLanguage;
    }

    if (!lang && typeof localStorage !== 'undefined') {
        lang = localStorage.getItem('app_lang') || localStorage.getItem('language');
    }

    if (lang) {
        lang = lang.toLowerCase().substring(0, 2);
    }

    if (!lang || !NOTE_DATA[lang]) {
        lang = 'en';
    }

    return lang;
}

function startNoteViewer() {
    currentNoteStep = 0;
    musicStarted = false;
    
    disableGameInput();

    if (typeof AudioManager !== 'undefined') {
        AudioManager.stopBgm();
    }

    document.getElementById('noteViewerModal').style.display = 'flex';
    renderNoteStep();
}

function renderNoteStep() {
    const lang = getCurrentLang();
    const sequence = NOTE_DATA[lang] || NOTE_DATA['en'];
    const stepData = sequence[currentNoteStep];

    if (stepData) {
        const imgElem = document.getElementById('noteImage');
        if (stepData.img) {
            imgElem.src = stepData.img;
            imgElem.style.display = 'block';

            if (!musicStarted) {
                musicStarted = true;
                noteAudio = new Audio('audio/bgm/The truth that you leave.ogg');
                noteAudio.loop = true;
                fadeInAudio(noteAudio, 1.0, 2000);
            }
        } else {
            imgElem.src = '';
            imgElem.style.display = 'none';
        }

        startTypewriter(stepData.text);
    } else {
        closeNoteViewer();
    }
}

window.nextNoteStep = function() {
    if (isTyping) {
        completeTypewriter();
        return;
    }

    currentNoteStep++;
    const lang = getCurrentLang();
    const sequence = NOTE_DATA[lang] || NOTE_DATA['en'];

    if (currentNoteStep < sequence.length) {
        renderNoteStep();
    } else {
        closeNoteViewer();
    }
};

function closeNoteViewer() {
    clearInterval(typewriterTimer);
    isTyping = false;

    document.getElementById('noteViewerModal').style.display = 'none';

    fadeOutAudio(noteAudio, 1000, () => {
        noteAudio = null;
        musicStarted = false;
    });

    enableGameInput();

    if (typeof $gameSystem !== 'undefined' && typeof AudioManager !== 'undefined') {
        const bgm = $gameSystem.saveBgm();
        if (bgm && bgm.name) {
            AudioManager.playBgm(bgm);
        } else {
            AudioManager.stopBgm();
        }
    }
}

setInterval(() => {
    if (typeof $gameMap !== 'undefined' && $gameMap && typeof $gamePlayer !== 'undefined') {
        const btnContainer = document.getElementById('note-access-container');
        if (btnContainer) {
            const isMap27 = $gameMap.mapId() === 27;
            const isTransferring = $gamePlayer.isTransferring();

            if (isMap27 && !isTransferring) {
                localStorage.setItem('has_visited_map_27', 'true');
            }

            const hasVisited = localStorage.getItem('has_visited_map_27') === 'true';
            if (hasVisited) {
                btnContainer.style.display = 'block';
            } else {
                btnContainer.style.display = 'none';
            }
        }
    }
}, 250);

function disableGameInput() {
    if (typeof Input !== 'undefined' && Input._currentState) {
        Input.clear();
    }
    if (typeof TouchInput !== 'undefined') {
        TouchInput.clear();
    }

    if (!noteKeyBlocker) {
        noteKeyBlocker = function(event) {
            event.stopPropagation();
            
            if (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' ' || event.key === 'z' || event.key === 'Z')) {
                window.nextNoteStep();
            }
        };

        window.addEventListener('keydown', noteKeyBlocker, true);
        window.addEventListener('keyup', noteKeyBlocker, true);
        window.addEventListener('keypress', noteKeyBlocker, true);
    }
}

function enableGameInput() {
    if (noteKeyBlocker) {
        window.removeEventListener('keydown', noteKeyBlocker, true);
        window.removeEventListener('keyup', noteKeyBlocker, true);
        window.removeEventListener('keypress', noteKeyBlocker, true);
        noteKeyBlocker = null;
    }

    if (typeof Input !== 'undefined') {
        Input.clear();
    }
    if (typeof TouchInput !== 'undefined') {
        TouchInput.clear();
    }
}

function fadeInAudio(audio, targetVolume = 1.0, duration = 1500) {
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch(e => console.log("Audio play error:", e));
    
    const step = 50;
    const increment = targetVolume / (duration / step);
    
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume + increment < targetVolume) {
            audio.volume += increment;
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        }
    }, step);
}

function fadeOutAudio(audio, duration = 1000, callback = null) {
    if (!audio) {
        if (callback) callback();
        return;
    }
    const step = 50;
    const decrement = audio.volume / (duration / step);
    
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume - decrement > 0) {
            audio.volume -= decrement;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
            if (callback) callback();
        }
    }, step);
}

function startTypewriter(text, speed = 30) {
    const textContainer = document.getElementById('noteTextContent');
    if (!textContainer) return;

    clearInterval(typewriterTimer);
    textContainer.textContent = "";
    currentFullText = text;
    isTyping = true;
    let index = 0;

    typewriterTimer = setInterval(() => {
        if (index < text.length) {
            textContainer.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typewriterTimer);
            isTyping = false;
        }
    }, speed);
}

function completeTypewriter() {
    clearInterval(typewriterTimer);
    const textContainer = document.getElementById('noteTextContent');
    if (textContainer) {
        textContainer.textContent = currentFullText;
    }
    isTyping = false;
}
