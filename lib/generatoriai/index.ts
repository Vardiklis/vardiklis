import { atsitiktinumas } from '../sekla'
import {
  funkcijos,
  greitosiosFormules,
  lygciuSistemos,
  nelygybes,
  raidiniaiReiskiniai,
  saknys,
} from './algebra'
import {
  algoritmai,
  diagramos,
  erdvinesFiguros,
  piramide,
  prizme,
  figuros,
  konstravimas,
  koordinates,
  lauzes,
  ornamentai,
  simetrija,
  vektoriai,
} from './braizymas'
import { dalumas } from './dalumas'
import {
  apskritimas,
  kampai,
  perimetras,
  pitagoras,
  plotasTuris,
  trigonometrija,
} from './geometrija'
import { kvadratinesLygtys, tiesinesLygtys } from './lygtys'
import { medzioAmzius, medzioAukstis, miskoSekla } from './miskas'
import { laipsniai } from './laipsniai'
import { neigiami } from './neigiami'
import {
  daiktuRikiavimas,
  daugiauMaziau,
  lyguNelygu,
  skaiciuRasymas,
  vieta,
} from './pirmokams'
import {
  atimtisIki9,
  atimtisIki20,
  atimtisPerDesimti,
  atimtiesUzdaviniai,
  demuoSuma,
  desimtysVienetai,
  kiekIsViso,
  kiekLiko,
  padidinkSumazink,
  palyginimasIki20,
  skaiciavimasIki20,
  skaicius10,
  sudetisIki9,
  sudetisIki20,
  sudetisPerDesimti,
  sudetiesUzdaviniai,
  tekstinisUzdavinys,
  trukstamasSkaicius,
  trysDemenys,
  turinysAteminys,
  veiksmuRysys,
} from './pirmoku-veiksmai'
import {
  arUztenkaPinigu,
  atkarpuMatavimas,
  centimetras,
  geometrijosZenklai,
  ilgioUzdaviniai,
  keliasSimboliais,
  kelioAprasymas,
  kilogramas,
  laikoTrukme,
  matavimasLiniuote,
  metras,
  metroUzdaviniai,
  nestandartiniaiMatai,
  para,
  piesinysBrezinys,
  pilnosValandos,
  sunkesnisLengvesnis,
} from './pirmoku-matavimas'
import {
  atimtisEilutePerDesimti,
  atimtisStulpeliu,
  atimtiesSchema,
  duDvizenkliai,
  dvizenklisMinusVienazenklis,
  dvizenklisPlusVienazenklis,
  dvizenkliuAtimtis,
  ikiPilnosDesimties,
  lietuvosPinigai,
  palyginimasIki100,
  piniguVerte,
  skaiciavimasDesimtimis,
  skaiciausSkyriai,
  sudetisEilutePerDesimti,
  sudetisStulpeliu,
  sudetiesSchema,
} from './pirmoku-simtas'
import {
  algoritmoTikrinimas,
  duomenuGrupavimas,
  ivykioTiketinumas,
  keliAlgoritmai,
  knygosRaida,
  knyguRekordai,
  knyguTirazai,
  padalosParinkimas,
  padalosVerte,
  perskaitytosKnygos,
  xlogo,
} from './treciokams-duomenys'
import {
  figuruKompozicija,
  kasYraLygtis,
  lygtisIsSchemos,
  nezinomasDalinys,
  nezinomasDaugiklis,
  nezinomasDemuo,
  nezinomasTurinys,
  raidinisReiskinys3,
  reiskinysIsPiesinio,
  reiskinysIsSalygos,
} from './treciokams-lygtys'
import {
  atsakymoPagrindimas,
  budoPasirinkimas,
  keliBudai,
  lygiosTrupmenos,
  trupmenosSuMatais,
  trupmenosTieseje,
  trupmenuModelis,
  trupmenuPalyginimas,
  visumosRadimas,
} from './treciokams-trupmenos'
import {
  daugybaApvaliais,
  dalybaApvaliais,
  dalybaSuLiekana,
  daugybosZaidimas,
  dvizenklioDalyba,
  dvizenklioDaugyba,
  kartuSekos3,
  keturzenklioDalyba,
  nulisDalmenyje,
  tekstiniaiDaugybaDalyba,
  trizenklioDalyba,
  trizenklioDaugyba,
  uzdavinysBudais,
} from './treciokams-daugyba'
import {
  ivykioTrukme,
  kalendoriausSkaitymas,
  tvarkarascioSkaitymas,
} from './treciokams-laikas'
import {
  braizymasPerimetras,
  decimetras,
  ilgioVienetai3,
  perimetroSavoka,
  staciakampioKrastine,
  staciakampioPerimetras,
  stalozaidimas,
  taisyklingoKrastine,
  taisyklingoPerimetras,
} from './treciokams-perimetras'
import {
  butinosIslaidos,
  islaiduSkaiciavimas,
  kiekAtpigo,
  kurIsleidziami,
  paslaugosKaina,
  piniguVerte3,
  taupymas,
} from './treciokams-pinigai'
import {
  aikstesMaketas,
  apskritimoSkersmuo,
  apskritimoSpindulys,
  erdvesSkaidymas,
  figuruPadetys,
  figuruSkaidymas,
  gretasienioElementai,
  kampuRusys,
  objektoPostumis,
  prizmeIrPiramide,
  simetriskaFigura,
  tiesiuPadetys,
} from './treciokams-geometrija'
import {
  apvalinimas10000,
  atimtisArdantDesimti,
  atimtisArdantSimta,
  atimtisArdantTukstanti,
  atimtisBeArdymo,
  parduotuvesUzdavinys,
  skaiciai10000,
  skaiciuSudarymas,
  sudetisBeTukstancio,
  sudetisSuTukstanciu,
  tekstiniai10000,
} from './treciokams-tukstanciai'
import {
  atimtiesBudai,
  dalisSuSkaitikliu,
  daugybaArDalyba,
  daugybosLentele3,
  paprastojiTrupmena,
  patikrinimas,
  patogusSkaiciavimas,
  picosDalys,
  sekos3,
  skaiciaiIki1000,
  skaiciausDalis,
  sudetiesBudai,
  tekstiniai1000,
  trupmenuUzdaviniai,
} from './treciokams-skaiciai'
import {
  atimtis100000,
  daugyba100000,
  daugybaDalyba10000,
  dalyba100000,
  dviPintosSekos,
  dvizenkliuDaugybaStulpeliu,
  programaUzduociai,
  reiskinysPagalUzdavini,
  skaiciaiIki10000,
  skaiciuSudarymas100000,
  sudetis100000,
  sudetisAtimtis10000,
  tekstiniaiUzdaviniai4,
  trizenklisIsDvizenklio,
  veiksmuTvarka4,
} from './ketvirtokams-skaiciai'
import {
  desimtainiaiSkaiciai4,
  desimtainiuSekos,
  gaminioSavikaina,
  kainuDaugybaDalyba,
  misriejiSkaiciai,
  misriejiTieseje,
  misriujuApvalinimas,
  misriujuSudetis,
  prekiuKainaDesimtainiais,
  trupmenaIrDesimtainis,
  trupmenosKartojimas4,
  trupmenuSudetis4,
  trupmenuTekstiniai4,
} from './ketvirtokams-trupmenos'
import {
  lygiosFiguros,
  objektuSekos4,
  patalposPlotas,
  plokstumosFiguros,
  plotasIrPerimetras,
  plotoTekstiniai,
  plotoVienetai,
  staciakampioPlotas,
  sudetinesFigurosPlotas,
  trikampiaiPagalKampus,
  trikampiaiPagalKrastines,
} from './ketvirtokams-plotas'
import {
  apvalinimas1000000,
  atimtis1000000,
  daugyba1000000,
  dalyba1000000,
  keliuZingsniuUzdavinys,
  matematinisKlausimas,
  mintinisSkaiciavimas,
  palyginimas1000000,
  pertekliniaiDuomenys,
  reiskinysSuSkliaustais,
  rezultatoPatikra,
  skaiciuSandara1000000,
  skaiciuSkaitymas1000000,
  skyriuSuma,
  sudetis1000000,
  tukstIrMln,
} from './ketvirtokams-milijonas'
import {
  lygtiesNezinomasis,
  lygtiesSavoka,
  lygtisPagalSalyga,
  lygtisPagalSchema,
  paprastaLygtis,
  raidinioReiskinioReiksme,
  raidinioReiskinioSavoka,
  raidinisPagalSalyga,
  salygaSchemaReiskinys,
  skirtingosLygtys,
  sprendinioPatikra,
} from './ketvirtokams-lygtys'
import {
  laikrodzioRodmenys,
  masesLaikoTemperaturosUzdaviniai,
  matavimoVienetoParinkimas,
  odometroRodmenys,
  svarstykliuRodmenys4,
  termometroRodmenys4,
  vienetuPalyginimas,
} from './ketvirtokams-matavimai'
import {
  greicioSkaiciavimas,
  greicioTikroviskumas,
  greicioVienetai,
  judejimoLaikas,
  judejimoUzdaviniai,
  kasYraGreitis,
  kasYraKelias,
  kelioSkaiciavimas,
  keliasLaikasGreitis,
  vidutinisGreitis,
} from './ketvirtokams-greitis'
import {
  bendraPirkinioKaina,
  kainosPokytis,
  kainosVertinimas,
  kainuPalyginimas,
  kiekPiniguLiko,
  naudingesnisSprendimas,
  pajamosIrIslaidos,
  pasirinkimoPagrindimas,
  piniguSumaDesimtaine,
  taupymoPlanas,
} from './ketvirtokams-finansai'
import {
  judejimasTinklelyje,
  kasYraPosukis,
  komanduSeka,
  langelioVietaRaide,
  objektasPagalVieta,
  ornamentoApibudinimas,
  ornamentoKurimas,
  pasaulioKryptys,
  posukioKryptis,
  posukisApieTaska,
  posukisStaciuojuKampu,
  vietaSkaiciuPora,
} from './ketvirtokams-konstravimas'
import {
  figuraIrIsklotine,
  kasYraTuris,
  kodelKubasYpatingas,
  konstravimasIsIsklotines,
  kubasIrGretasienis,
  kubinisCentimetras,
  kubinisMetras,
  prizmeIrPiramide4,
  ritinysIrKugis,
  sienosBriaunosVirsunes,
  statinioKubeliai,
  turisKubeliais,
  turioVienetoParinkimas,
  vaizdasIsPriekio,
  vaizdasIsVirsausUzd,
} from './ketvirtokams-turis'
import {
  atsakymaiPagalDiagrama,
  duomenuRinkimoPlanas,
  duomenuSisteminimas,
  isvadosPagristumas,
  linijinesDiagramosBraizymas,
  linijinesDiagramosSkaitymas,
  pateikimoBudoPasirinkimas,
  skritulinesDiagramosSkaitymas,
  skritulinesDiagramosSudarymas,
  statistinisKlausimas,
  tyrimoIsvada,
  tyrimoPristatymas,
} from './ketvirtokams-duomenys'
import {
  bandymasIrBaigtis,
  bandymasSuKauliuku,
  bandymasSuMoneta,
  bandymasSuSuktuku,
  bandymoRezultatai,
  labiauTiketina,
  maziauTiketina,
  sazingasZaidimas,
  spejimasIrEksperimentas,
  tikimybeSkaiciumi,
  vienodaiTiketinos,
  visosBaigtys,
} from './ketvirtokams-tikimybe'
import {
  algoritmoKlaida,
  algoritmoSudarymas,
  algoritmoTeisingumas,
  desimtainiuSeka4,
  kartojimoKomanda,
  komandosSuKartojimu,
  objektuAugimoSeka,
  pasirinkimasIrKartojimas,
  sekosKurimas,
  skirtingiAlgoritmai,
  trupmenuSeka,
  uzduotiesSkaidymas,
} from './ketvirtokams-algoritmai'
import {
  apvalinameIkiDesimciu,
  apvalinameIkiSkyriaus,
  palyginameSkaicius5,
  rasomeRomeniskai,
  rasomeSkaicius,
  romeniskiejiSkaitmenys,
  skaiciuTiese5,
  skaiciusIrSkaitmuo,
  skaitmensReiksme,
  skyriuLentele5,
} from './penktokams-skaiciai'
import {
  atimtiesDesniai,
  dalybaKampu5,
  dalybosDesniai,
  daugybosJungiamumas,
  daugybosPerstatomumas,
  daugybosSkirstomumas,
  judejimasIsSkirtingu,
  judejimasIsTosPacios,
  kelioFormule,
  skaiciuAtimtis5,
  sudetiesJungiamumas,
  sudetiesPerstatomumas,
  sumosDalijimas,
} from './penktokams-veiksmai'
import {
  dalumasIs10Ir100,
  dalumasIs4,
  dalumasIs5Ir2,
  dalumasIs9Ir3,
  didziausiasisBendrasisDaliklis,
  maziausiasisBendrasisKartotinis,
  pirminiaiIrSudetiniai,
  skaiciausDalikliai,
  skaiciausKartotiniai,
  skaidymasPirminiais,
} from './penktokams-dalumas'
import {
  desimtainiaiSkaiciai5,
  finansiniaiSkaiciavimai5,
  lygusDesimtainiai,
  netaisyklingaIrMisrus,
  pagrindineTrupmenosSavybe,
  procentai5,
  skaiciausDaliesRadimas,
  skaiciausRadimasIsDalies,
  taisyklingosTrupmenos,
  trupmenaIrDesimtainis5,
  trupmenosDesimtainiaiProcentai,
} from './penktokams-trupmenos'
import {
  bendravardiklinimas5,
  misriojoDaugybaIsNaturaliojo,
  misriujuAtimtis5,
  misriujuSudetis5,
  naturaliujuIrMisriujuAtimtis,
  trupmenosDaugybaIsNaturaliojo,
  trupmenuAtimtisSkirtingi,
  trupmenuAtimtisVienodi,
  trupmenuPalyginimasSkirtingi,
  trupmenuPalyginimasVienodi,
  trupmenuSudetisSkirtingi,
  trupmenuSudetisVienodi,
} from './penktokams-trupmenu-veiksmai'
import {
  daugybaIs101001000,
  desimtainioDaugyba,
  desimtainiuApvalinimasSkyriumi,
  desimtainiuApvalinimasVienetais,
  desimtainiuAtimtis,
  desimtainiuPalyginimas,
  desimtainiuSudetis,
} from './penktokams-desimtainiai'
import {
  lygtiesSprendimas5,
  lygtisIrSprendinys,
  lygybiuSavybes,
  panasiejiNariai,
  raidinioReiskinioReiksmes,
  raidinisReiskinys,
  skaiciuSekosLenteles,
  skaitinisReiskinys,
  skliaustuAtskleidimas,
  tekstiniaiSuLygtimis5,
} from './penktokams-lygtys'
import {
  braizomePusiaukampine,
  gretutiniaiKampai,
  istiestinisIrStatusis,
  kampasIrElementai,
  kampuDydziaiBuki,
  kampuDydziaiSmailus,
  kampuPalyginimas,
  kryzminiaiKampai,
  kurisKampasDidesnis,
  laipsnis,
  matlankisMatuojame,
  pilnasisIrPriespilnis,
  smailusisIrBukasis,
} from './penktokams-kampai'
import {
  daugiakampioKampai,
  daugiakampis5,
  ilgioVienetai5,
  keturkampioPerimetras,
  plotoVienetai5,
  staciakampioPlotas5,
  staciojoTrikampioPlotas,
  trikampioKampai,
  trikampioPerimetras,
} from './penktokams-figuros'
import {
  lygiagretainisRombasTrapecija,
  lygiagretusisPostumis,
  posukisApieTaska5,
  simetrijosAsis5,
  simetrijosCentras,
  simetriskosTaskoAtzvilgiu,
  simetriskosTiesesAtzvilgiu,
} from './penktokams-simetrija'
import {
  erdviniuKunuVaizdavimas,
  gretasienioPavirsiausPlotas,
  gretasienioTuris,
  kuboPavirsiausPlotas,
  kuboTuris,
  matmenysIrIsklotine,
  talpa5,
  turis5,
} from './penktokams-kunai'
import {
  bandymasIrBaigtys,
  imtisIrVidurkis,
  ivykioTikimybe,
  kokybiniaiIrKiekybiniai,
} from './penktokams-duomenys'
import {
  skaiciaiTieseje6,
  priesingiejiSkaiciai,
  sveikujuPalyginimas6,
  skaiciuAibes,
  koordinaciuPlokstuma6,
  sudetisVienodiZenklai,
  sudetisSkirtingiZenklai,
  racionaliujuAtimtis,
  algebrineSuma,
} from './sestokams-skaiciai'
import {
  trupmenosDaugyba6,
  trupmenuDaugyba6,
  trupmenosDalybaIsNaturaliojo,
  dalybaIsTrupmenos,
  desimtainioDaugyba6,
  desimtainiuDaugyba,
  desimtainioDalyba,
  periodinesTrupmenos,
  desimtainiuDalyba,
} from './sestokams-trupmenos'
import {
  neigiamuDaugyba,
  neigiamuDalyba,
  neigiamuDaugybaDalyba,
  skirstomumoDesnis6,
  reiskiniuReiksmes6,
} from './sestokams-zenklai'
import {
  trupmenosDesimtainiaiProcentai6,
  skaiciausDalis6,
  visasSkaicius6,
  proporcijosSavybe,
  procentaiProporcija,
  dalijimasProporcingai,
  finansai6,
  formulesLenteles,
  grafikai6,
  tiesiogiaiProporcingi,
  proporcingumoGrafikas6,
} from './sestokams-procentai'
import {
  raidinioKoeficientas,
  panasiujuSutraukimas6,
  atskliautimas,
  paprastosLygtys6,
  sudetingesnesLygtys,
  lygtysSuSkliaustais,
  tekstiniaiLygtys6,
} from './sestokams-lygtys'
import {
  lygiosFiguros6,
  trikampioKrastinesKampai,
  lygumasDviKrastinesKampas,
  lygumasKrastineDuKampai,
  lygumasTrysKrastines,
  braizomeLyguKampa,
  braizomeLyguTrikampi,
  trikampioNelygybe,
  didinameMazinime,
  mastelis6,
  panasiosiosFiguros,
  trikampiuPanasumas,
  figuruSekos6,
  metrineSistema,
} from './sestokams-figuros'
import {
  daznuLentele6,
  stulpelineDiagrama6,
  linijineDiagrama6,
  imtiesVidurkis6,
  imtiesMediana,
  imtiesModa,
  galimybiuMedis6,
  galimybiuLentele6,
  daugybosTaisykle,
  ivykis6,
  ivykioTikimybe6,
  priesingasIvykis,
} from './sestokams-duomenys'
import {
  teisingiKlaidingiTeiginiai,
  aksiomaApibrezimasTeorema,
  irodymas,
  kvadratuIrKubu,
  laipsnisNaturalusisRodiklis,
  laipsniaiVienodiPagrindai,
  laipsniaiVienodiRodikliai,
  laipsniKeliameLaipsniu,
  neigiamasRodiklis,
  neigiamoRodiklioSavybes,
  standartineIsraiska,
} from './septintokams-laipsniai'
import {
  kiekProcentuPakito,
  dydisPoPokycio,
  paprastosiosPalukanos,
  sudetinesPalukanos,
  sudetiniaiProcentai,
  biudzetasIrPaskolos,
  skaiciuPalyginimas7,
  skaiciuIntervalai,
  nelygybePridedame,
  nelygybeDauginame,
  nelygybesSprendinys,
  vienoZingsnioNelygybes,
  paprastosNelygybes,
  sudetingesnesNelygybes,
  nelygybiuSistema,
  dvigubosNelygybes,
  nelygybiuTekstiniai,
  susijeDydziai,
  atvirksciaiProporcingi,
  atvirkstinioGrafikas,
  atvirkstinioTekstiniai,
} from './septintokams-nelygybes'
import {
  taskasIrTiese,
  susikertanciosTieses,
  lygiagreciosTieses,
  lygiagretumoPozymiai,
  kampaiSuKirstine,
  konstravimasPlokstumoje,
  trikampiuRusys,
  trikampioAukstines,
  trikampioPusiaukrastines,
  trikampioPusiaukampines,
  lygiagretainis7,
  staciakampis7,
  rombas7,
  kvadratas7,
  trapecija7,
  trapecijuRusys,
  daugiakampiaiPlokstumoje,
} from './septintokams-figuros'
import {
  pagrindiniuFiguruPlotai,
  trikampioPlotas7,
  lygiagretainioPlotas,
  romboPlotas,
  trapecijosPlotas,
  apskritimas7,
  apskritimoIlgis,
  apskritimoLankas,
  skritulioPlotas,
} from './septintokams-plotai'
import {
  tiesesIrPlokstumos,
  staciojiPrizme7,
  prizmesTuris,
  piramide7,
  piramidesTuris,
  ritinys7,
  ritinioPlotasTuris,
  kugis7,
  kugioPlotasTuris,
  statistinisTyrimas,
  imtisAtsitiktine,
  imciuRusys,
  statistinisKintamasis,
  skritulinesDiagramos,
} from './septintokams-kunai'
import {
  kvadratineSaknis,
  kubineSaknis,
  iracionaliejiSkaiciai,
  saknuPalyginimas,
  saknuSudetis,
  saknisIsSandaugos,
  saknisIsTrupmenos,
  iskeliameIkeliame,
  skaitiniaiSuSaknimis,
  raidiniaiSuSaknimis,
  skaiciuAibes8,
  aibesPoaibis,
  realiejiSkaiciai,
  veiksmaiSuRealiaisiais,
} from './astuntokams-saknys'
import {
  valiutuKursai,
  palukanuRusys,
  palukanosIrGrafikai,
  pirkimasIssimoketinai,
  mazejanciosPalukanos,
  vienanarisDaugianaris,
  atskliautimas8,
  daugianariuDaugyba,
  dvinarioKvadratas,
  sumosIrSkirtumoSandauga,
  bendrojoDaugiklioIskelimas,
  skaidymasGrupavimu,
  skaidymasFormulemis,
  dvinarioKvadratoIsskyrimas,
} from './astuntokams-reiskiniai'
import {
  tiesineLygtisDviem,
  tiesinesLygtiesGrafikas,
  lygciuSistema8,
  sistemosSprendiniuSkaicius,
  sistemosKeitimoBudu,
  sistemosSulyginimoBudu,
  sistemosSudetiesBudu,
  sistemuJudejimoUzdaviniai,
  sistemuTekstiniai,
  tiesinisSarysis,
  vektoriausSavoka,
  vektoriuLygumas,
  vektoriuSudetis,
  vektoriuAtimtis,
  vektoriausDaugyba,
} from './astuntokams-sistemos'
import {
  pitagoroTeorema,
  atvirkstinePitagoro,
  atstumasTarpTasku,
  statinisPries30,
  lygiasonisLygiakrastis,
  trikampioVidurioLinija,
  trapecijosVidurioLinija,
  staciojiPrizme8,
  taisyklingojiPiramide8,
  ritinys8,
  kugis8,
  rutulysIrSfera,
  objektoVaizdaiMastelis,
} from './astuntokams-figuros'
import {
  empirinisSkirstinys,
  sukauptiejiDazniai,
  sugrupuotuDiagrama,
  histograma8,
  imtiesCharakteristikos,
  kvartiliai,
  usuDiagramaUzd,
} from './astuntokams-duomenys'
import {
  kartojimasAibes,
  kartojimasDalumas,
  kartojimasVeiksmai,
  kartojimasTrupmenos,
  kartojimasProporcingumas,
  kartojimasProcentai,
  kartojimasLaipsniai,
  kartojimasRaidiniai,
  kartojimasLygtys,
  kartojimasNelygybes,
  kartojimasKampai,
  kartojimasTrikampiai,
  kartojimasKeturkampiai,
  kartojimasApskritimas,
  kartojimasVektoriai,
  kartojimasSimetrija,
  kartojimasKunai,
  kartojimasStatistika,
  kartojimasTikimybes,
} from './astuntokams-kartojimas'
import {
  susijeDydziai9,
  funkcijaIrGrafikas,
  funkcijosSavybes,
  skaiciuSeka,
  rekurentinesSekos,
  apibrezimoSritis,
  tiesioginisProporcingumas,
  tiesineFunkcija9,
  tiesinesFunkcijosSavybes,
  dviejuTiesiuPadetis,
} from './devintokams-funkcijos'
import {
  kvadratinesLygtiesSamprata,
  nepilnosiosKvadratines,
  pilnojiKvadratine,
  sprendiniuFormules,
  trinarioSkaidymas,
  vijetoTeorema,
  kvadratinesFunkcijosSamprata,
  grafikoTransformacijos,
  kvadratinesFunkcijosSavybes,
} from './devintokams-kvadratines'
import {
  trupmeninioReiskinioSamprata,
  trupmenuDaugybaDalyba,
  trupmenuSudetisAtimtis,
  trupmeniniaiSudetingesni,
  sistemosAlgebriskai,
  sistemosGrafiskai,
  sistemosSudetingesnes,
} from './devintokams-trupmenos'
import {
  sinusasKosinusasTangentas,
  trigonometrinesReiksmes,
  skaiciuotuvasTrigonometrija,
  trigonometrinesFormules,
  staciujuTrikampiuSprendimas,
} from './devintokams-trigonometrija'
import {
  liestineIrKirstine,
  centrinisIrIbreztinis,
  styguSavybes,
  ispjovaIrNuopjova,
  proporcingosAtkarpos,
} from './devintokams-apskritimas'
import {
  sklaidosDiagramaUzd,
  tiesineKoreliacija,
  tieseSklaidosDiagramoje,
  imtiesDydzioItaka,
  koreliacijaNePriezastis,
} from './devintokams-duomenys'
import {
  trupmeninesLygtiesSamprata,
  trupmenaLygiNuliui,
  trupmeniniuLygciuBudai,
  judejimoUzdaviniai10,
  darboUzdaviniai,
  misiniuUzdaviniai,
} from './desimtokams-trupmenines'
import {
  posukioKampas,
  trigonometrinesReiksmes10,
  trikampioPlotasSinusu,
  sinusuTeorema,
  kosinusuTeorema,
} from './desimtokams-trigonometrija'
import {
  sistemosSamprata,
  atvirkstinisProporcingumas,
  sistemosGrafiskai10,
  sistemosAlgebriskai10,
  sistemuUzdaviniai,
  sistemosKeitiniai,
} from './desimtokams-sistemos'
import {
  kvadratinesNelygybesSamprata,
  nelygybeParabole,
  nelygybeSistemomis,
  nelygybiuTaikymas,
  nelygybiuSistemos,
  trupmeninesNelygybes,
} from './desimtokams-nelygybes'
import {
  trukstamaInformacija,
  proporcingaDalyba,
  fibonacioSeka,
  auksoPjuvis,
  sudetiniaiProcentai10,
  dziovinimoUzdaviniai,
  lydiniaiTirpalai,
} from './desimtokams-desningumai'
import {
  panasumoSantykiai,
  pusiaukampiniuSavybes,
  pusiaukrastiniuSavybes,
  ibreztasApskritimas,
  apibreztasApskritimas,
  plotoFormulesRp,
  ibreztiniaiKeturkampiai,
  geometriniaiIrodymai,
} from './desimtokams-figuros'
import {
  populiacijaIrImtis,
  duomenuKintamumas,
  dispersijaNuokrypis,
  skirstiniuFormos,
  centroIrSklaidosInterpretavimas,
  statistinisPatikimumas,
} from './desimtokams-duomenys'
import {
  elementuRinkiniai,
  elementuTvarka,
  rinkiniuSkaicius,
  sudetiesTaisykle,
  daugybosTaisykle10,
  teorineEksperimentine,
  ilgalaikisDaznis,
} from './desimtokams-kombinatorika'
import {
  erdvesFiguros,
  figurosBraizymas,
  figurosDalis,
  gramai,
  ilgioTyrimas,
  ilgioUzdaviniai2,
  ilgioVienetai,
  kilometrai,
  masesTyrimas,
  masesUzdaviniai,
  metraiCentimetrai,
  milimetrai,
  nuoroduAlgoritmas,
  pasirinkimoKomanda,
  plotasLangeliais,
  scratchJr2,
  skraidykle,
  svarstykliuRodmuo,
  talposUzdaviniai,
  talposVienetai,
  tonos,
} from './antroku-vienetai'
import {
  atimtisIki1000,
  atimtisIsApvalaus,
  atimtisIsardant,
  dviejuZingsniuSchema,
  dviejuZingsniuSprendimas,
  piniguStambinimas,
  skaiciuSkaitymas,
  sudetisIki1000,
  sudetisIkiApvalaus,
  sudetisPerzengiant,
  trizenkliuSandara,
  trizenkliuSekos,
  uzdavinioKurimas,
} from './antroku-tukstantis'
import {
  astuntadalis,
  dalybaKampuUzd,
  dalybaSuNuliu,
  daugybaDalybaIs6,
  daugybaDalybaIs7,
  daugybaDalybaIs8Ir9,
  kiekKartu,
  lygybeNelygybe,
  skliaustai,
  veiksmuTvarka2,
  visumaPagalDali,
} from './antroku-daugyba-dalyba'
import {
  kaMatuojaTermometras,
  kasPerMinute,
  kiekIsgaravo,
  laikasMinutemis,
  laikoTyrimas,
  laikrodziuIstorija,
  oruDuomenys,
  smelioLaikrodis,
  stebejimoLentele,
  termometroRodmuo,
  valandosDalys,
  vandensDalis,
  vandensTemperatura,
  vanduoIrLedas,
} from './antroku-matai'
import {
  asiuRusys,
  daugiakampiai,
  figuruTeiginiai,
  kasYraKampas,
  kasYraLauzte,
  planoKelias,
  planoKurimas,
  simetriskosFiguros,
  simetrijosAsis,
  taisyklingasDaugiakampis,
} from './antroku-figuros'
import {
  daugybaIs0Ir1,
  daugybaIs10,
  daugybaIs2,
  daugybaIs3,
  daugybaIs4,
  daugybaIs5,
  daugybosLentelesNaudojimas,
  daugybosUzdaviniai,
  kartuSekos,
  kasYraDaugyba,
  matematinisZaidimas,
  sudetisIDaugyba,
} from './antroku-daugyba'
import {
  dalybaIs2,
  dalybaIs3Ir4,
  dalybaIs5,
  daugybosDalybosRysys,
  kasYraDalyba,
  lyginiaiNelyginiai,
  puse,
  sumazinkKartus,
  talposDalyba,
  trecdalisKetvirtadalis,
  vienosPrekesKaina,
} from './antroku-dalyba'
import {
  atimtiesBudas,
  atimtisEilute2,
  atimtisStulpeliu2,
  desimtysMinusDvizenklis,
  nezinomasSkaicius,
  sudetiesBudas,
  sudetisEilute2,
  sudetisStulpeliu2,
  tekstiniaiAtimties,
  tekstiniaiSudeties,
  uzdavinioSchema,
} from './antroku-veiksmai'
import {
  blueBot,
  irArba,
  kasYraAlgoritmas,
  kasYraKomanda,
  scratchJr,
} from './pirmoku-programos'
import {
  diagramosBraizymas,
  diagramosSkaitymas,
  kasYraDuomenys,
  manoTyrimas,
  piktogramosSkaitymas,
  senoveZenklai,
  skaiciuInformacija,
  tyrimoEiga,
  zenkluReiksme,
} from './pirmoku-duomenys'
import {
  dalumoPozymiai,
  logika,
  misiniai,
  rekurenciosSekos,
  saknuIvertinimas,
  skaitmenys,
  sklaida,
  vijeto,
} from './papildomi'
import {
  apvalinimas,
  dalisIrVisuma,
  desimtaines,
  laikas,
  matavimoVienetai,
  pinigai,
  sekos,
  skaiciuPalyginimas,
  sudetisAtimtis,
  veiksmuTvarka,
} from './pradinukams'
import { procentai } from './procentai'
import { proporcijos } from './proporcijos'
import { sveikieji } from './sveikieji'
import {
  atvirkstinis,
  greitis,
  kombinatorika,
  palukanos,
  tikimybe,
  vidurkis,
} from './taikomieji'
import { bendravardiklinimas, trupmenuDaugyba, trupmenuSudetis } from './trupmenos'
import { pavidaluEile, sablonas } from './bendra'
import { gretimiSkaiciai, simtalange, skaiciuTiese } from './simtalange'
import { sritisKlasei, uzRibos, type Sritis } from './sritis'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

export type { Generatorius, Lygis, Sritis, Uzdavinys }

/**
 * Generatorių registras. Raktas nurodomas `lib/programa.ts` potemėje — iš ten
 * jį paima ir uždavinių biblioteka, ir diagnostika.
 *
 * Pridedant naują generatorių pakanka įrašyti jį čia ir nurodyti raktą potemėje.
 */
export const generatoriai: Record<string, Generatorius> = {
  // Aritmetika ir pradinės klasės
  'sudetis-atimtis': sudetisAtimtis,
  'skaiciu-palyginimas': skaiciuPalyginimas,
  sekos,
  'dalies-radimas': dalisIrVisuma,
  pinigai,
  laikas,
  'matavimo-vienetai': matavimoVienetai,
  apvalinimas,
  'veiksmu-tvarka': veiksmuTvarka,
  desimtaines,
  sveikieji,

  // Trupmenos ir skaičiai
  dalumas,
  bendravardiklinimas,
  'trupmenu-sudetis': trupmenuSudetis,
  'trupmenu-daugyba': trupmenuDaugyba,
  neigiami,
  procentai,

  // Algebra
  'raidiniai-reiskiniai': raidiniaiReiskiniai,
  'tiesines-lygtys': tiesinesLygtys,
  nelygybes,
  laipsniai,
  saknys,
  'greitosios-formules': greitosiosFormules,
  'lygciu-sistemos': lygciuSistemos,
  'kvadratines-lygtys': kvadratinesLygtys,
  funkcijos,

  // Proporcingumas ir taikymai
  proporcijos,
  atvirkstinis,
  greitis,
  palukanos,

  // Geometrija
  perimetras,
  'plotas-turis': plotasTuris,
  kampai,
  pitagoras,
  apskritimas,
  trigonometrija,

  // Braižymas, transformacijos ir figūros — su savais SVG brėžiniais
  koordinates,
  simetrija,
  figuros,
  lauzes,
  'erdvines-figuros': erdvinesFiguros,
  piramide,
  prizme,
  vektoriai,
  konstravimas,
  ornamentai,
  algoritmai,

  // 5–10 klasių turinio aprašo reikalaujami gebėjimai
  'dalumo-pozymiai': dalumoPozymiai,
  skaitmenys,
  'saknu-ivertinimas': saknuIvertinimas,
  sklaida,
  vijeto,
  misiniai,
  'rekurencios-sekos': rekurenciosSekos,
  logika,

  // 1 klasės erdviniai santykiai ir skaičių išdėstymas
  vieta,
  'daiktu-rikiavimas': daiktuRikiavimas,
  'skaiciu-rasymas': skaiciuRasymas,
  'lygu-nelygu': lyguNelygu,
  'daugiau-maziau': daugiauMaziau,
  simtalange,
  'skaiciu-tiese': skaiciuTiese,
  'gretimi-skaiciai': gretimiSkaiciai,

  // 1 klasės 2 tema — sudėtis ir atimtis nuo 0 iki 9. Kiekviena potemė turi
  // savo generatorių: anksčiau visos vienuolika rodė tą patį `sudetis-atimtis`.
  'kiek-is-viso': kiekIsViso,
  'sudetis-iki-9': sudetisIki9,
  'demuo-suma': demuoSuma,
  'trys-demenys': trysDemenys,
  'sudeties-uzdaviniai': sudetiesUzdaviniai,
  'kiek-liko': kiekLiko,
  'atimtis-iki-9': atimtisIki9,
  'turinys-ateminys': turinysAteminys,
  'atimties-uzdaviniai': atimtiesUzdaviniai,
  'veiksmu-rysys': veiksmuRysys,
  'trukstamas-skaicius': trukstamasSkaicius,

  // 1 klasės 3 tema — dviženkliai skaičiai iki 20
  'skaicius-10': skaicius10,
  'skaiciavimas-iki-20': skaiciavimasIki20,
  'desimtys-vienetai': desimtysVienetai,
  'palyginimas-iki-20': palyginimasIki20,
  'sudetis-iki-20': sudetisIki20,
  'sudetis-per-desimti': sudetisPerDesimti,
  'atimtis-iki-20': atimtisIki20,
  'atimtis-per-desimti': atimtisPerDesimti,
  'tekstinis-uzdavinys': tekstinisUzdavinys,
  'padidink-sumazink': padidinkSumazink,

  // 1 klasės 4 tema — matavimas ir braižymas. Bendrieji generatoriai čia
  // duodavo milimetrus, decimetrus ir įstrižaines — ne pirmos klasės dalykus.
  'nestandartiniai-matai': nestandartiniaiMatai,
  centimetras,
  'matavimas-liniuote': matavimasLiniuote,
  'ilgio-uzdaviniai': ilgioUzdaviniai,
  'geometrijos-zenklai': geometrijosZenklai,
  'piesinys-brezinys': piesinysBrezinys,
  'atkarpu-matavimas': atkarpuMatavimas,
  'kelias-simboliais': keliasSimboliais,
  'kelio-aprasymas': kelioAprasymas,

  // 1 klasės 9 tema — matai: pilnos valandos, para, monetos, metras, kilogramas
  'pilnos-valandos': pilnosValandos,
  para,
  'laiko-trukme': laikoTrukme,
  'ar-uztenka-pinigu': arUztenkaPinigu,
  metras,
  'metro-uzdaviniai': metroUzdaviniai,
  kilogramas,
  'sunkesnis-lengvesnis': sunkesnisLengvesnis,

  // 1 klasės 5 tema — skaičiai iki 100
  'skaiciavimas-desimtimis': skaiciavimasDesimtimis,
  'skaiciaus-skyriai': skaiciausSkyriai,
  'palyginimas-iki-100': palyginimasIki100,
  'lietuvos-pinigai': lietuvosPinigai,
  'pinigu-verte': piniguVerte,

  // 1 klasės 8 tema — sudėtis ir atimtis iki 100
  'dvizenklis-plius-vienazenklis': dvizenklisPlusVienazenklis,
  'iki-pilnos-desimties': ikiPilnosDesimties,
  'sudetis-eilute-per-desimti': sudetisEilutePerDesimti,
  'sudetis-stulpeliu': sudetisStulpeliu,
  'du-dvizenkliai': duDvizenkliai,
  'dvizenklis-minus-vienazenklis': dvizenklisMinusVienazenklis,
  'atimtis-eilute-per-desimti': atimtisEilutePerDesimti,
  'atimtis-stulpeliu': atimtisStulpeliu,
  'dvizenkliu-atimtis': dvizenkliuAtimtis,
  'sudeties-schema': sudetiesSchema,
  'atimties-schema': atimtiesSchema,

  // 1 klasės 6 tema — ženklai, ir 7 tema — duomenys
  'zenklu-reiksme': zenkluReiksme,
  'senove-zenklai': senoveZenklai,
  'skaiciu-informacija': skaiciuInformacija,
  'kas-yra-duomenys': kasYraDuomenys,
  'piktogramos-skaitymas': piktogramosSkaitymas,
  'diagramos-skaitymas': diagramosSkaitymas,
  'diagramos-braizymas': diagramosBraizymas,
  'tyrimo-eiga': tyrimoEiga,
  'mano-tyrimas': manoTyrimas,

  // 1 klasės 11 tema — komanda, algoritmas, IR/ARBA, Blue-Bot, ScratchJr
  'kas-yra-komanda': kasYraKomanda,
  'kas-yra-algoritmas': kasYraAlgoritmas,
  'ir-arba': irArba,
  'blue-bot': blueBot,
  'scratch-jr': scratchJr,

  // 2 klasės 1 tema — sudėties ir atimties būdai iki 100. Vienuolika potemių
  // anksčiau dalijosi bendruoju `sudetis-atimtis`, tad „stulpeliu“ neduodavo
  // stulpelio, o „išskaidant atėminį“ — skaidymo.
  'sudeties-budas': sudetiesBudas,
  'atimties-budas': atimtiesBudas,
  'nezinomas-skaicius': nezinomasSkaicius,
  'sudetis-eilute-2': sudetisEilute2,
  'sudetis-stulpeliu-2': sudetisStulpeliu2,
  'desimtys-minus-dvizenklis': desimtysMinusDvizenklis,
  'atimtis-eilute-2': atimtisEilute2,
  'atimtis-stulpeliu-2': atimtisStulpeliu2,
  'tekstiniai-sudeties': tekstiniaiSudeties,
  'tekstiniai-atimties': tekstiniaiAtimties,
  'uzdavinio-schema': uzdavinioSchema,

  // 2 klasės 2 tema — daugyba. Anksčiau visos potemės rėmėsi 6 klasės
  // `sveikieji` generatoriumi ir duodavo neigiamus skaičius.
  'kas-yra-daugyba': kasYraDaugyba,
  'sudetis-i-daugyba': sudetisIDaugyba,
  'kartu-sekos': kartuSekos,
  'daugyba-is-2': daugybaIs2,
  'daugyba-is-3': daugybaIs3,
  'daugyba-is-4': daugybaIs4,
  'daugyba-is-5': daugybaIs5,
  'daugyba-is-0-ir-1': daugybaIs0Ir1,
  'daugyba-is-10': daugybaIs10,
  'daugybos-lentele': daugybosLentelesNaudojimas,
  'daugybos-uzdaviniai': daugybosUzdaviniai,
  'matematinis-zaidimas': matematinisZaidimas,

  // 2 klasės 3 tema — dalyba
  'kas-yra-dalyba': kasYraDalyba,
  'daugybos-dalybos-rysys': daugybosDalybosRysys,
  'dalyba-is-2': dalybaIs2,
  puse,
  'dalyba-is-3-ir-4': dalybaIs3Ir4,
  'talpos-dalyba': talposDalyba,
  'trecdalis-ketvirtadalis': trecdalisKetvirtadalis,
  'lyginiai-nelyginiai': lyginiaiNelyginiai,
  'dalyba-is-5': dalybaIs5,
  'vienos-prekes-kaina': vienosPrekesKaina,
  'sumazink-kartus': sumazinkKartus,

  // 2 klasės 4 tema — plokščiosios figūros. Potemės rėmėsi vyresnių klasių
  // generatoriais: `figuros` duodavo įstrižaines ir perimetrus, `kampai` —
  // laipsnius, `simetrija` — koordinačių plokštumą, `koordinates` — ašis.
  'kas-yra-lauzte': kasYraLauzte,
  'kas-yra-kampas': kasYraKampas,
  daugiakampiai,
  'taisyklingas-daugiakampis': taisyklingasDaugiakampis,
  'simetrijos-asis': simetrijosAsis,
  'asiu-rusys': asiuRusys,
  'simetriskos-figuros': simetriskosFiguros,
  'figuru-teiginiai': figuruTeiginiai,
  'plano-kelias': planoKelias,
  'plano-kurimas': planoKurimas,

  // 2 klasės termometro, laiko ir vandens temos. Anksčiau jos rėmėsi 6 klasės
  // `neigiami`, bendraisiais `matavimo-vienetai` ir `diagramos` generatoriais.
  'ka-matuoja-termometras': kaMatuojaTermometras,
  'termometro-rodmuo': termometroRodmuo,
  'oru-duomenys': oruDuomenys,
  'laikrodziu-istorija': laikrodziuIstorija,
  'smelio-laikrodis': smelioLaikrodis,
  'kas-per-minute': kasPerMinute,
  'valandos-dalys': valandosDalys,
  'laikas-minutemis': laikasMinutemis,
  'laiko-tyrimas': laikoTyrimas,
  'vandens-dalis': vandensDalis,
  'kiek-isgaravo': kiekIsgaravo,
  'vandens-temperatura': vandensTemperatura,
  'vanduo-ir-ledas': vanduoIrLedas,
  'stebejimo-lentele': stebejimoLentele,

  // 2 klasės tema „Daugyba ir dalyba“. Rėmėsi 6 klasės `sveikieji`,
  // `veiksmu-tvarka` ir trupmenų `dalies-radimas` generatoriais.
  'daugyba-dalyba-is-6': daugybaDalybaIs6,
  'daugyba-dalyba-is-7': daugybaDalybaIs7,
  'dalyba-kampu': dalybaKampuUzd,
  'daugyba-dalyba-is-8-ir-9': daugybaDalybaIs8Ir9,
  astuntadalis,
  'kiek-kartu': kiekKartu,
  'dalyba-su-nuliu': dalybaSuNuliu,
  'lygybe-nelygybe': lygybeNelygybe,
  'veiksmu-tvarka-2': veiksmuTvarka2,
  skliaustai,
  'visuma-pagal-dali': visumaPagalDali,

  // 2 klasės tema „Skaičiai iki 1000“ — šimtų skyrius, sudėtis ir atimtis su
  // apvaliais skaičiais bei dviejų žingsnių uždaviniai.
  'skaiciu-skaitymas': skaiciuSkaitymas,
  'trizenkliu-sandara': trizenkliuSandara,
  'pinigu-stambinimas': piniguStambinimas,
  'trizenkliu-sekos': trizenkliuSekos,
  'sudetis-iki-1000': sudetisIki1000,
  'sudetis-iki-apvalaus': sudetisIkiApvalaus,
  'sudetis-perzengiant': sudetisPerzengiant,
  'dvieju-zingsniu-schema': dviejuZingsniuSchema,
  'dvieju-zingsniu-sprendimas': dviejuZingsniuSprendimas,
  'atimtis-iki-1000': atimtisIki1000,
  'atimtis-is-apvalaus': atimtisIsApvalaus,
  'atimtis-isardant': atimtisIsardant,
  'uzdavinio-kurimas': uzdavinioKurimas,

  // 2 klasės temos „Ilgio matavimas“ ir „Masės ir talpos matavimas. Algoritmai“
  'metrai-centimetrai': metraiCentimetrai,
  milimetrai,
  'ilgio-vienetai': ilgioVienetai,
  'figuros-braizymas': figurosBraizymas,
  'plotas-langeliais': plotasLangeliais,
  'figuros-dalis': figurosDalis,
  'erdves-figuros': erdvesFiguros,
  kilometrai,
  'ilgio-uzdaviniai-2': ilgioUzdaviniai2,
  'ilgio-tyrimas': ilgioTyrimas,
  skraidykle,
  gramai,
  'svarstykliu-rodmuo': svarstykliuRodmuo,
  tonos,
  'mases-uzdaviniai': masesUzdaviniai,
  'mases-tyrimas': masesTyrimas,
  'talpos-vienetai': talposVienetai,
  'talpos-uzdaviniai': talposUzdaviniai,
  'pasirinkimo-komanda': pasirinkimoKomanda,
  'nuorodu-algoritmas': nuoroduAlgoritmas,
  'scratch-jr-2': scratchJr2,

  // 3 klasės 1 tema — skaičiavimai iki 1000 ir paprastosios trupmenos.
  // Anksčiau visos keturiolika potemių rėmėsi bendraisiais generatoriais, o
  // penkios trupmenų potemės dalijosi vienu `dalies-radimas`.
  'skaiciai-iki-1000': skaiciaiIki1000,
  'sekos-3': sekos3,
  'sudeties-budai-1000': sudetiesBudai,
  'atimties-budai-1000': atimtiesBudai,
  'patogus-skaiciavimas': patogusSkaiciavimas,
  patikrinimas,
  'daugyba-ar-dalyba': daugybaArDalyba,
  'daugybos-lentele-3': daugybosLentele3,
  'tekstiniai-1000': tekstiniai1000,
  'paprastoji-trupmena': paprastojiTrupmena,
  'skaiciaus-dalis': skaiciausDalis,
  'dalis-su-skaitikliu': dalisSuSkaitikliu,
  'trupmenu-uzdaviniai': trupmenuUzdaviniai,
  'picos-dalys': picosDalys,

  // 3 klasės 2 tema — sudėtis ir atimtis iki 10 000. Šešios atimties potemės
  // skiriasi tuo, kurį skyrių tenka išardyti, tad kiekviena turi savo skaičių
  // parinkimą — bendras `sudetis-atimtis` to skirtumo neparodydavo.
  'skaiciai-10000': skaiciai10000,
  'skaiciu-sudarymas': skaiciuSudarymas,
  'apvalinimas-10000': apvalinimas10000,
  'sudetis-be-tukstancio': sudetisBeTukstancio,
  'sudetis-su-tukstanciu': sudetisSuTukstanciu,
  'atimtis-be-ardymo': atimtisBeArdymo,
  'atimtis-ardant-desimti': atimtisArdantDesimti,
  'atimtis-ardant-simta': atimtisArdantSimta,
  'atimtis-ardant-tukstanti': atimtisArdantTukstanti,
  'tekstiniai-10000': tekstiniai10000,
  'parduotuves-uzdavinys': parduotuvesUzdavinys,

  // 3 klasės 3 tema — geometrinės figūros. Beveik kiekvienas klausimas yra
  // apie tai, ką mokinys mato, tad visos potemės gavo savo brėžinius; anksčiau
  // jas dengė vyresnių klasių `kampai`, `apskritimas` ir `koordinates`.
  'kampu-rusys': kampuRusys,
  'tiesiu-padetys': tiesiuPadetys,
  'apskritimo-spindulys': apskritimoSpindulys,
  'apskritimo-skersmuo': apskritimoSkersmuo,
  'figuru-padetys': figuruPadetys,
  'figuru-skaidymas': figuruSkaidymas,
  'simetriska-figura': simetriskaFigura,
  'objekto-postumis': objektoPostumis,
  'gretasienio-elementai': gretasienioElementai,
  'prizme-ir-piramide': prizmeIrPiramide,
  'erdves-skaidymas': erdvesSkaidymas,
  'aikstes-maketas': aikstesMaketas,

  // 3 klasės 4 tema — daugiakampio perimetras. Potemės skiriasi klausimo
  // kryptimi: iš kraštinių į perimetrą arba atvirkščiai.
  decimetras,
  'ilgio-vienetai-3': ilgioVienetai3,
  'perimetro-savoka': perimetroSavoka,
  'taisyklingo-perimetras': taisyklingoPerimetras,
  'staciakampio-perimetras': staciakampioPerimetras,
  'braizymas-perimetras': braizymasPerimetras,
  'taisyklingo-krastine': taisyklingoKrastine,
  'staciakampio-krastine': staciakampioKrastine,
  'stalo-zaidimas': stalozaidimas,

  // 3 klasės 5 tema — laikas.
  'ivykio-trukme': ivykioTrukme,
  'tvarkarascio-skaitymas': tvarkarascioSkaitymas,
  'kalendoriaus-skaitymas': kalendoriausSkaitymas,

  // 3 klasės 6 tema — pinigai. Bendrasis `pinigai` duodavo kainas su kableliu,
  // `procentai` — nuolaidas procentais; nei vieno, nei kito trečioje klasėje dar nėra.
  'pinigu-verte-3': piniguVerte3,
  'kur-isleidziami': kurIsleidziami,
  'butinos-islaidos': butinosIslaidos,
  'islaidu-skaiciavimas': islaiduSkaiciavimas,
  'kiek-atpigo': kiekAtpigo,
  taupymas,
  'paslaugos-kaina': paslaugosKaina,

  // 3 klasės 7 tema — daugyba ir dalyba iki 10 000. Potemės skiriasi tuo, kas
  // veiksme naujo: apvalus daugiklis, peržengiamas skyrius ar nulis dalmenyje.
  'daugyba-apvaliais': daugybaApvaliais,
  'dvizenklio-daugyba': dvizenklioDaugyba,
  'trizenklio-daugyba': trizenklioDaugyba,
  'dalyba-apvaliais': dalybaApvaliais,
  'dalyba-su-liekana': dalybaSuLiekana,
  'dvizenklio-dalyba': dvizenklioDalyba,
  'trizenklio-dalyba': trizenklioDalyba,
  'keturzenklio-dalyba': keturzenklioDalyba,
  'nulis-dalmenyje': nulisDalmenyje,
  'kartu-sekos-3': kartuSekos3,
  'tekstiniai-daugyba-dalyba': tekstiniaiDaugybaDalyba,
  'uzdavinys-budais': uzdavinysBudais,
  'daugybos-zaidimas': daugybosZaidimas,

  // 3 klasės 8 tema — lygtys ir raidiniai reiškiniai. Nežinomasis randamas
  // prisimenant veiksmo dalių ryšį, o ne perkeliant narius.
  'kas-yra-lygtis': kasYraLygtis,
  'nezinomas-demuo': nezinomasDemuo,
  'nezinomas-turinys': nezinomasTurinys,
  'nezinomas-daugiklis': nezinomasDaugiklis,
  'nezinomas-dalinys': nezinomasDalinys,
  'lygtis-is-schemos': lygtisIsSchemos,
  'raidinis-reiskinys-3': raidinisReiskinys3,
  'reiskinys-is-salygos': reiskinysIsSalygos,
  'reiskinys-is-piesinio': reiskinysIsPiesinio,
  'figuru-kompozicija': figuruKompozicija,

  // 3 klasės 9 tema — trupmenos ir tekstiniai uždaviniai.
  'trupmenos-tieseje': trupmenosTieseje,
  'trupmenu-palyginimas': trupmenuPalyginimas,
  'lygios-trupmenos': lygiosTrupmenos,
  'trupmenos-su-matais': trupmenosSuMatais,
  'visumos-radimas': visumosRadimas,
  'budo-pasirinkimas': budoPasirinkimas,
  'atsakymo-pagrindimas': atsakymoPagrindimas,
  'keli-budai': keliBudai,
  'trupmenu-modelis': trupmenuModelis,

  // 3 klasės 10 tema — duomenys ir algoritmai. Diagramos padala nebėra
  // vienetas, tad jos vertės klausimas turi prasmę.
  'padalos-verte': padalosVerte,
  'padalos-parinkimas': padalosParinkimas,
  'duomenu-grupavimas': duomenuGrupavimas,
  'ivykio-tiketinumas': ivykioTiketinumas,
  'keli-algoritmai': keliAlgoritmai,
  'algoritmo-tikrinimas': algoritmoTikrinimas,
  xlogo,

  // 3 klasės 11 tema — reiškinys „Knyga“: datos, tiražai, lentelės, diagramos.
  'knygos-raida': knygosRaida,
  'perskaitytos-knygos': perskaitytosKnygos,
  'knygu-rekordai': knyguRekordai,
  'knygu-tirazai': knyguTirazai,

  // Tyrinėju reiškinį „Miškas“ — sėklos, medžių aukštis, kelmo rievės
  'misko-sekla': miskoSekla,
  'medzio-aukstis': medzioAukstis,
  'medzio-amzius': medzioAmzius,

  // ── 4 klasė ───────────────────────────────────────────────────────────────
  // 1 tema „Skaičiai ir skaičiavimai iki 100 000“. Pakeitė `sveikieji`,
  // `skaitmenys`, `sekos` ir `veiksmu-tvarka`, kurie skirti 5–10 klasėms.
  'skaiciai-iki-10000-4': skaiciaiIki10000,
  'sudetis-atimtis-10000-4': sudetisAtimtis10000,
  'daugyba-dalyba-10000-4': daugybaDalyba10000,
  'tekstiniai-uzdaviniai-4': tekstiniaiUzdaviniai4,
  'dvizenkliu-daugyba-stulpeliu': dvizenkliuDaugybaStulpeliu,
  'trizenklis-is-dvizenklio': trizenklisIsDvizenklio,
  'skaiciu-sudarymas-100000': skaiciuSudarymas100000,
  'sudetis-100000': sudetis100000,
  'atimtis-100000': atimtis100000,
  'daugyba-100000': daugyba100000,
  'dalyba-100000': dalyba100000,
  'dvi-pintos-sekos': dviPintosSekos,
  'veiksmu-tvarka-4': veiksmuTvarka4,
  'reiskinys-pagal-uzdavini': reiskinysPagalUzdavini,
  'programa-uzduociai': programaUzduociai,

  // 2 tema „Mišrieji ir dešimtainiai skaičiai“. Pakeitė `trupmenu-sudetis`,
  // `desimtaines`, `pinigai` ir `apvalinimas` — juose pasitaikydavo skirtingų
  // vardiklių ir tūkstantųjų dalių, kurių 4 klasėje dar nėra.
  'trupmenos-kartojimas-4': trupmenosKartojimas4,
  'trupmenu-tekstiniai-4': trupmenuTekstiniai4,
  'misrieji-skaiciai': misriejiSkaiciai,
  'misrieji-tieseje': misriejiTieseje,
  'misriuju-apvalinimas': misriujuApvalinimas,
  'trupmenu-sudetis-4': trupmenuSudetis4,
  'misriuju-sudetis': misriujuSudetis,
  'desimtainiai-skaiciai-4': desimtainiaiSkaiciai4,
  'trupmena-ir-desimtainis': trupmenaIrDesimtainis,
  'prekiu-kaina-desimtainiais': prekiuKainaDesimtainiais,
  'kainu-daugyba-dalyba': kainuDaugybaDalyba,
  'desimtainiu-sekos': desimtainiuSekos,
  'gaminio-savikaina': gaminioSavikaina,

  // 3 tema „Plokščiosios figūros. Plotas“. Pakeitė `figuros`, `kampai` ir
  // `plotas-turis` — juose pasitaikydavo apskritimo ploto ir aukštinių.
  'plokstumos-figuros': plokstumosFiguros,
  'objektu-sekos-4': objektuSekos4,
  'lygios-figuros': lygiosFiguros,
  'trikampiai-pagal-krastines': trikampiaiPagalKrastines,
  'trikampiai-pagal-kampus': trikampiaiPagalKampus,
  'ploto-vienetai': plotoVienetai,
  'staciakampio-plotas': staciakampioPlotas,
  'sudetines-figuros-plotas': sudetinesFigurosPlotas,
  'ploto-tekstiniai': plotoTekstiniai,
  'plotas-ir-perimetras': plotasIrPerimetras,
  'patalpos-plotas': patalposPlotas,

  // 4 tema „Skaičiai iki 1 000 000“. Šešios paskutinės potemės yra ne apie
  // skaičius, o apie darbą su uždaviniu, tad ten dažnas pasirenkamasis atsakymas.
  'skaiciu-skaitymas-1000000': skaiciuSkaitymas1000000,
  'skaiciu-sandara-1000000': skaiciuSandara1000000,
  'skyriu-suma': skyriuSuma,
  'tukst-ir-mln': tukstIrMln,
  'palyginimas-1000000': palyginimas1000000,
  'apvalinimas-1000000': apvalinimas1000000,
  'sudetis-1000000': sudetis1000000,
  'atimtis-1000000': atimtis1000000,
  'daugyba-1000000': daugyba1000000,
  'dalyba-1000000': dalyba1000000,
  'mintinis-skaiciavimas': mintinisSkaiciavimas,
  'rezultato-patikra': rezultatoPatikra,
  'pertekliniai-duomenys': pertekliniaiDuomenys,
  'keliu-zingsniu-uzdavinys': keliuZingsniuUzdavinys,
  'reiskinys-su-skliaustais': reiskinysSuSkliaustais,
  'matematinis-klausimas': matematinisKlausimas,

  // 5 tema „Lygtys ir raidiniai reiškiniai“. Pakeitė `tiesines-lygtys` ir
  // `raidiniai-reiskiniai` — juose pasitaikydavo neigiamų sprendinių.
  'lygties-savoka': lygtiesSavoka,
  'lygties-nezinomasis': lygtiesNezinomasis,
  'lygtis-pagal-salyga': lygtisPagalSalyga,
  'lygtis-pagal-schema': lygtisPagalSchema,
  'paprasta-lygtis': paprastaLygtis,
  'sprendinio-patikra': sprendinioPatikra,
  'skirtingos-lygtys': skirtingosLygtys,
  'raidinio-reiskinio-savoka': raidinioReiskinioSavoka,
  'raidinio-reiskinio-reiksme': raidinioReiskinioReiksme,
  'raidinis-pagal-salyga': raidinisPagalSalyga,
  'salyga-schema-reiskinys': salygaSchemaReiskinys,

  // 6 tema „Matavimo prietaisai ir rodmenys“ — rodmuo visada brėžinyje.
  'svarstykliu-rodmenys-4': svarstykliuRodmenys4,
  'laikrodzio-rodmenys': laikrodzioRodmenys,
  'termometro-rodmenys-4': termometroRodmenys4,
  'odometro-rodmenys': odometroRodmenys,
  'matavimo-vieneto-parinkimas': matavimoVienetoParinkimas,
  'vienetu-palyginimas': vienetuPalyginimas,
  'mases-laiko-temperaturos-uzdaviniai': masesLaikoTemperaturosUzdaviniai,

  // 7 tema „Kelias, laikas ir greitis“ — visos potemės apie tą patį ryšį
  // $s = v \cdot t$, tad skiriasi tai, kuris dydis nežinomas.
  'kas-yra-kelias': kasYraKelias,
  'kas-yra-greitis': kasYraGreitis,
  'kelias-laikas-greitis': keliasLaikasGreitis,
  'kelio-skaiciavimas': kelioSkaiciavimas,
  'judejimo-laikas': judejimoLaikas,
  'greicio-skaiciavimas': greicioSkaiciavimas,
  'vidutinis-greitis': vidutinisGreitis,
  'greicio-vienetai': greicioVienetai,
  'judejimo-uzdaviniai': judejimoUzdaviniai,
  'greicio-tikroviskumas': greicioTikroviskumas,

  // 8 tema „Finansiniai sprendimai“. Pakeitė `pinigai`, `procentai` ir
  // `proporcijos` — ketvirtokui tekdavo nuolaidos procentai ir palūkanos.
  'pinigu-suma-desimtaine': piniguSumaDesimtaine,
  'kainu-palyginimas': kainuPalyginimas,
  'bendra-pirkinio-kaina': bendraPirkinioKaina,
  'kainos-pokytis': kainosPokytis,
  'pajamos-ir-islaidos': pajamosIrIslaidos,
  'kiek-pinigu-liko': kiekPiniguLiko,
  'taupymo-planas': taupymoPlanas,
  'kainos-vertinimas': kainosVertinimas,
  'naudingesnis-sprendimas': naudingesnisSprendimas,
  'pasirinkimo-pagrindimas': pasirinkimoPagrindimas,

  // 9 tema „Konstravimas ir transformacijos“ — vieta tinklelyje, judėjimas,
  // posūkiai ir ornamentai. Visos potemės remiasi tuo pačiu tinkleliu.
  'langelio-vieta-raide': langelioVietaRaide,
  'vieta-skaiciu-pora': vietaSkaiciuPora,
  'objektas-pagal-vieta': objektasPagalVieta,
  'judejimas-tinklelyje': judejimasTinklelyje,
  'pasaulio-kryptys': pasaulioKryptys,
  'komandu-seka': komanduSeka,
  'ornamento-apibudinimas': ornamentoApibudinimas,
  'kas-yra-posukis': kasYraPosukis,
  'posukis-apie-taska': posukisApieTaska,
  'posukio-kryptis': posukioKryptis,
  'posukis-staciuoju-kampu': posukisStaciuojuKampu,
  'ornamento-kurimas': ornamentoKurimas,

  // 10 tema „Erdvės figūros ir tūris“ — tūris pradedamas nuo kubelių, o ne nuo
  // formulės, tad statiniai piešiami nepermatomi.
  'kas-yra-turis': kasYraTuris,
  'turis-kubeliais': turisKubeliais,
  'kubinis-centimetras': kubinisCentimetras,
  'kubinis-metras': kubinisMetras,
  'turio-vieneto-parinkimas': turioVienetoParinkimas,
  'statinio-kubeliai': statinioKubeliai,
  'kubas-ir-gretasienis': kubasIrGretasienis,
  'kodel-kubas-ypatingas': kodelKubasYpatingas,
  'prizme-ir-piramide-4': prizmeIrPiramide4,
  'ritinys-ir-kugis': ritinysIrKugis,
  'sienos-briaunos-virsunes': sienosBriaunosVirsunes,
  'figura-ir-isklotine': figuraIrIsklotine,
  'vaizdas-is-virsaus': vaizdasIsVirsausUzd,
  'vaizdas-is-priekio': vaizdasIsPriekio,
  'konstravimas-is-isklotines': konstravimasIsIsklotines,

  // 11 tema „Duomenys ir statistinis tyrimas“ — tyrimas eina iš eilės: nuo
  // klausimo iki išvados pagrįstumo.
  'statistinis-klausimas': statistinisKlausimas,
  'duomenu-rinkimo-planas': duomenuRinkimoPlanas,
  'duomenu-sisteminimas': duomenuSisteminimas,
  'linijines-diagramos-skaitymas': linijinesDiagramosSkaitymas,
  'linijines-diagramos-braizymas': linijinesDiagramosBraizymas,
  'skritulines-diagramos-skaitymas': skritulinesDiagramosSkaitymas,
  'skritulines-diagramos-sudarymas': skritulinesDiagramosSudarymas,
  'atsakymai-pagal-diagrama': atsakymaiPagalDiagrama,
  'pateikimo-budo-pasirinkimas': pateikimoBudoPasirinkimas,
  'tyrimo-pristatymas': tyrimoPristatymas,
  'tyrimo-isvada': tyrimoIsvada,
  'isvados-pagristumas': isvadosPagristumas,

  // 12 tema „Tikimybė“ — ketvirtoje klasėje tai palyginimas, o ne skaičiavimas.
  'bandymas-ir-baigtis': bandymasIrBaigtis,
  'visos-baigtys': visosBaigtys,
  'labiau-tiketina': labiauTiketina,
  'maziau-tiketina': maziauTiketina,
  'vienodai-tiketinos': vienodaiTiketinos,
  'bandymas-su-moneta': bandymasSuMoneta,
  'bandymas-su-kauliuku': bandymasSuKauliuku,
  'bandymas-su-suktuku': bandymasSuSuktuku,
  'bandymo-rezultatai': bandymoRezultatai,
  'spejimas-ir-eksperimentas': spejimasIrEksperimentas,
  'tikimybe-skaiciumi': tikimybeSkaiciumi,
  'sazingas-zaidimas': sazingasZaidimas,

  // 13 tema „Dėsningumai, algoritmai ir programavimas“.
  'trupmenu-seka': trupmenuSeka,
  'desimtainiu-seka-4': desimtainiuSeka4,
  'objektu-augimo-seka': objektuAugimoSeka,
  'sekos-kurimas': sekosKurimas,
  'kartojimo-komanda': kartojimoKomanda,
  'komandos-su-kartojimu': komandosSuKartojimu,
  'pasirinkimas-ir-kartojimas': pasirinkimasIrKartojimas,
  'uzduoties-skaidymas': uzduotiesSkaidymas,
  'algoritmo-sudarymas': algoritmoSudarymas,
  'algoritmo-teisingumas': algoritmoTeisingumas,
  'algoritmo-klaida': algoritmoKlaida,
  'skirtingi-algoritmai': skirtingiAlgoritmai,

  // ── 5 klasė ───────────────────────────────────────────────────────────────
  // 1 tema „Natūralieji skaičiai“. Pakeitė `skaitmenys`, `koordinates`,
  // `skaiciu-palyginimas` ir `apvalinimas`, aptarnavusius kelias klases iškart.
  'skaicius-ir-skaitmuo': skaiciusIrSkaitmuo,
  'skyriu-lentele-5': skyriuLentele5,
  'skaitmens-reiksme': skaitmensReiksme,
  'rasome-skaicius': rasomeSkaicius,
  'skaiciu-tiese-5': skaiciuTiese5,
  'palyginame-skaicius-5': palyginameSkaicius5,
  'apvaliname-iki-desimciu': apvalinameIkiDesimciu,
  'apvaliname-iki-skyriaus': apvalinameIkiSkyriaus,
  'romeniskieji-skaitmenys': romeniskiejiSkaitmenys,
  'rasome-romeniskai': rasomeRomeniskai,

  // 2 tema „Veiksmai su natūraliaisiais skaičiais“. Kiekvienas dėsnis turi savo
  // generatorių: anksčiau ir perstatomumo, ir jungiamumo potemė duodavo tą patį
  // `348 + 527`, apie patį dėsnį neklausdama nieko.
  'sudeties-perstatomumas': sudetiesPerstatomumas,
  'sudeties-jungiamumas': sudetiesJungiamumas,
  'skaiciu-atimtis-5': skaiciuAtimtis5,
  'atimties-desniai': atimtiesDesniai,
  'daugybos-perstatomumas': daugybosPerstatomumas,
  'daugybos-jungiamumas': daugybosJungiamumas,
  'daugybos-skirstomumas': daugybosSkirstomumas,
  'dalyba-kampu-5': dalybaKampu5,
  'dalybos-desniai': dalybosDesniai,
  'sumos-dalijimas': sumosDalijimas,
  'kelio-formule': kelioFormule,
  'judejimas-is-tos-pacios': judejimasIsTosPacios,
  'judejimas-is-skirtingu': judejimasIsSkirtingu,

  // 3 tema „Dalumas“. Kiekvienas dalumo požymis turi savo taisyklę — iš 10
  // sprendžiama pagal paskutinį skaitmenį, iš 3 ir 9 — pagal skaitmenų sumą, iš
  // 4 — pagal du paskutinius, — tad ir savo generatorių.
  'dalumas-is-10-ir-100': dalumasIs10Ir100,
  'dalumas-is-5-ir-2': dalumasIs5Ir2,
  'dalumas-is-9-ir-3': dalumasIs9Ir3,
  'dalumas-is-4': dalumasIs4,
  'skaiciaus-dalikliai': skaiciausDalikliai,
  'pirminiai-ir-sudetiniai': pirminiaiIrSudetiniai,
  'skaidymas-pirminiais': skaidymasPirminiais,
  'didziausiasis-bendrasis-daliklis': didziausiasisBendrasisDaliklis,
  'skaiciaus-kartotiniai': skaiciausKartotiniai,
  'maziausiasis-bendrasis-kartotinis': maziausiasisBendrasisKartotinis,

  // 4 tema „Trupmeniniai skaičiai“. Pakeitė `trupmenu-sudetis`, `desimtaines`,
  // `procentai` ir `palukanos` — pastarasis skirtas 9–10 klasėms, tad penktokui
  // tekdavo sudėtinės palūkanos.
  'taisyklingos-trupmenos': taisyklingosTrupmenos,
  'netaisyklinga-ir-misrus': netaisyklingaIrMisrus,
  'pagrindine-trupmenos-savybe': pagrindineTrupmenosSavybe,
  'desimtainiai-skaiciai-5': desimtainiaiSkaiciai5,
  'lygus-desimtainiai': lygusDesimtainiai,
  'trupmena-ir-desimtainis-5': trupmenaIrDesimtainis5,
  'procentai-5': procentai5,
  'trupmenos-desimtainiai-procentai': trupmenosDesimtainiaiProcentai,
  'skaiciaus-dalies-radimas': skaiciausDaliesRadimas,
  'skaiciaus-radimas-is-dalies': skaiciausRadimasIsDalies,
  'finansiniai-skaiciavimai-5': finansiniaiSkaiciavimai5,

  // 5 tema. Trys potemių poros programoje vadinasi vienodai („Palyginame“,
  // „Sudedame“, „Atimame“), bet pirmoji pora yra apie vienodus vardiklius, o
  // antroji — apie skirtingus, kur pirma reikia bendravardiklinti. Tai du
  // skirtingi gebėjimai, tad ir generatoriai atskiri.
  'trupmenu-palyginimas-vienodi': trupmenuPalyginimasVienodi,
  'trupmenu-sudetis-vienodi': trupmenuSudetisVienodi,
  'misriuju-sudetis-5': misriujuSudetis5,
  'trupmenu-atimtis-vienodi': trupmenuAtimtisVienodi,
  'naturaliuju-ir-misriuju-atimtis': naturaliujuIrMisriujuAtimtis,
  'misriuju-atimtis-5': misriujuAtimtis5,
  'bendravardiklinimas-5': bendravardiklinimas5,
  'trupmenu-palyginimas-skirtingi': trupmenuPalyginimasSkirtingi,
  'trupmenu-sudetis-skirtingi': trupmenuSudetisSkirtingi,
  'trupmenu-atimtis-skirtingi': trupmenuAtimtisSkirtingi,
  'trupmenos-daugyba-is-naturaliojo': trupmenosDaugybaIsNaturaliojo,
  'misriojo-daugyba-is-naturaliojo': misriojoDaugybaIsNaturaliojo,

  // 6 tema. Anksciau sios potemes remesi bendrais apvalinimo ir sudeties
  // generatoriais, kurie apie kableli neklause nieko.
  'desimtainiu-palyginimas': desimtainiuPalyginimas,
  'desimtainiu-apvalinimas-vienetais': desimtainiuApvalinimasVienetais,
  'desimtainiu-apvalinimas-skyriumi': desimtainiuApvalinimasSkyriumi,
  'desimtainiu-sudetis': desimtainiuSudetis,
  'desimtainiu-atimtis': desimtainiuAtimtis,
  'desimtainio-daugyba': desimtainioDaugyba,
  'daugyba-is-10-100-1000': daugybaIs101001000,

  // 7 tema. Kartu ir programos potemė „Skaičių sekos ir įvesties-išvesties
  // lentelės“ — taisyklė, pagal kurią iš įvesties gaunama išvestis, yra
  // raidinis reiškinys.
  'skaitinis-reiskinys': skaitinisReiskinys,
  'raidinis-reiskinys': raidinisReiskinys,
  'raidinio-reiskinio-reiksmes': raidinioReiskinioReiksmes,
  'skliaustu-atskleidimas': skliaustuAtskleidimas,
  'panasieji-nariai': panasiejiNariai,
  'lygybiu-savybes': lygybiuSavybes,
  'lygtis-ir-sprendinys': lygtisIrSprendinys,
  'lygties-sprendimas-5': lygtiesSprendimas5,
  'tekstiniai-su-lygtimis-5': tekstiniaiSuLygtimis5,
  'skaiciu-sekos-lenteles': skaiciuSekosLenteles,

  // 8 tema. Kampu dydziai breziniuose visada tikri.
  'kampas-ir-elementai': kampasIrElementai,
  'kuris-kampas-didesnis': kurisKampasDidesnis,
  'istiestinis-ir-statusis': istiestinisIrStatusis,
  'smailusis-ir-bukasis': smailusisIrBukasis,
  'pilnasis-ir-priespilnis': pilnasisIrPriespilnis,
  laipsnis,
  'kampu-palyginimas': kampuPalyginimas,
  'kampu-dydziai-smailus': kampuDydziaiSmailus,
  'kampu-dydziai-buki': kampuDydziaiBuki,
  'matlankis-matuojame': matlankisMatuojame,
  'braizome-pusiaukampine': braizomePusiaukampine,
  'gretutiniai-kampai': gretutiniaiKampai,
  'kryzminiai-kampai': kryzminiaiKampai,

  // 9 tema. Ploto vienetu kaimynai skiriasi 100 kartu, ne 10 - tai tos potemes esme.
  'daugiakampis-5': daugiakampis5,
  'trikampio-kampai': trikampioKampai,
  'daugiakampio-kampai': daugiakampioKampai,
  'ilgio-vienetai-5': ilgioVienetai5,
  'trikampio-perimetras': trikampioPerimetras,
  'keturkampio-perimetras': keturkampioPerimetras,
  'ploto-vienetai-5': plotoVienetai5,
  'staciakampio-plotas-5': staciakampioPlotas5,
  'staciojo-trikampio-plotas': staciojoTrikampioPlotas,

  // 10 tema. Brezinys rodo tik pradine figura - atspindys ar posukio rezultatas piesiamas tik ten, kur klausiama apie pati veiksma.
  'simetriskos-tieses-atzvilgiu': simetriskosTiesesAtzvilgiu,
  'simetrijos-asis-5': simetrijosAsis5,
  'posukis-apie-taska-5': posukisApieTaska5,
  'simetriskos-tasko-atzvilgiu': simetriskosTaskoAtzvilgiu,
  'simetrijos-centras': simetrijosCentras,
  'lygiagretusis-postumis': lygiagretusisPostumis,
  'lygiagretainis-rombas-trapecija': lygiagretainisRombasTrapecija,

  // 11 tema. Pavirsiaus plotas ir turis cia pirma karta skiriami vienas nuo kito.
  'erdviniu-kunu-vaizdavimas': erdviniuKunuVaizdavimas,
  'matmenys-ir-isklotine': matmenysIrIsklotine,
  'gretasienio-pavirsiaus-plotas': gretasienioPavirsiausPlotas,
  'kubo-pavirsiaus-plotas': kuboPavirsiausPlotas,
  'turis-5': turis5,
  'gretasienio-turis': gretasienioTuris,
  'kubo-turis': kuboTuris,
  'talpa-5': talpa5,

  // 12 tema. Vidurkio uzdaviniuose skaiciai parenkami taip, kad dalyba butu be liekanos.
  'kokybiniai-ir-kiekybiniai': kokybiniaiIrKiekybiniai,
  'imtis-ir-vidurkis': imtisIrVidurkis,
  'bandymas-ir-baigtys': bandymasIrBaigtys,
  'ivykio-tikimybe': ivykioTikimybe,

  // 6 klasė. 1 ir 2 temos: neigiami skaičiai, skaičių tiesė, koordinačių plokštuma.
  'skaiciai-tieseje-6': skaiciaiTieseje6,
  'priesingieji-skaiciai': priesingiejiSkaiciai,
  'sveikuju-palyginimas-6': sveikujuPalyginimas6,
  'skaiciu-aibes': skaiciuAibes,
  'koordinaciu-plokstuma-6': koordinaciuPlokstuma6,
  'sudetis-vienodi-zenklai': sudetisVienodiZenklai,
  'sudetis-skirtingi-zenklai': sudetisSkirtingiZenklai,
  'racionaliuju-atimtis': racionaliujuAtimtis,
  'algebrine-suma': algebrineSuma,

  // 6 klasė. 3 ir 4 temos: trupmenų ir dešimtainių daugyba bei dalyba.
  'trupmenos-daugyba-6': trupmenosDaugyba6,
  'trupmenu-daugyba-6': trupmenuDaugyba6,
  'trupmenos-dalyba-is-naturaliojo': trupmenosDalybaIsNaturaliojo,
  'dalyba-is-trupmenos': dalybaIsTrupmenos,
  'desimtainio-daugyba-6': desimtainioDaugyba6,
  'desimtainiu-daugyba': desimtainiuDaugyba,
  'desimtainio-dalyba': desimtainioDalyba,
  'periodines-trupmenos': periodinesTrupmenos,
  'desimtainiu-dalyba': desimtainiuDalyba,

  // 6 klasė. 5 tema: ženklų taisyklė daugyboje ir dalyboje.
  'neigiamu-daugyba': neigiamuDaugyba,
  'neigiamu-dalyba': neigiamuDalyba,
  'neigiamu-daugyba-dalyba': neigiamuDaugybaDalyba,
  'skirstomumo-desnis-6': skirstomumoDesnis6,
  'reiskiniu-reiksmes-6': reiskiniuReiksmes6,

  // 6 klasė. 6 ir 7 temos: procentai, proporcija, tiesioginis proporcingumas.
  // Kartu ir programos potemė „Finansiniai skaičiavimai“ — nuolaida yra
  // procentas, o vieneto tarifas — tiesioginis proporcingumas.
  'trupmenos-desimtainiai-procentai-6': trupmenosDesimtainiaiProcentai6,
  'skaiciaus-dalis-6': skaiciausDalis6,
  'visas-skaicius-6': visasSkaicius6,
  'proporcijos-savybe': proporcijosSavybe,
  'procentai-proporcija': procentaiProporcija,
  'dalijimas-proporcingai': dalijimasProporcingai,
  'finansai-6': finansai6,
  'formules-lenteles': formulesLenteles,
  'grafikai-6': grafikai6,
  'tiesiogiai-proporcingi': tiesiogiaiProporcingi,
  'proporcingumo-grafikas-6': proporcingumoGrafikas6,

  // 6 klasė. 8 tema: reiškiniai su neigiamais koeficientais ir lygtys,
  // kuriose nežinomasis gali būti abiejose pusėse.
  'raidinio-koeficientas': raidinioKoeficientas,
  'panasiuju-sutraukimas-6': panasiujuSutraukimas6,
  'atskliautimas': atskliautimas,
  'paprastos-lygtys-6': paprastosLygtys6,
  'sudetingesnes-lygtys': sudetingesnesLygtys,
  'lygtys-su-skliaustais': lygtysSuSkliaustais,
  'tekstiniai-lygtys-6': tekstiniaiLygtys6,

  // 6 klasė. 9 ir 10 temos: trikampių lygumo ir panašumo požymiai, mastelis.
  // Kartu ir dvi programos potemės — figūrų sekos bei metrinė sistema.
  'lygios-figuros-6': lygiosFiguros6,
  'trikampio-krastines-kampai': trikampioKrastinesKampai,
  'lygumas-dvi-krastines-kampas': lygumasDviKrastinesKampas,
  'lygumas-krastine-du-kampai': lygumasKrastineDuKampai,
  'lygumas-trys-krastines': lygumasTrysKrastines,
  'braizome-lygu-kampa': braizomeLyguKampa,
  'braizome-lygu-trikampi': braizomeLyguTrikampi,
  'trikampio-nelygybe': trikampioNelygybe,
  'didiname-mazinime': didinameMazinime,
  'mastelis-6': mastelis6,
  'panasiosios-figuros': panasiosiosFiguros,
  'trikampiu-panasumas': trikampiuPanasumas,
  'figuru-sekos-6': figuruSekos6,
  'metrine-sistema': metrineSistema,

  // 6 klasė. 11 ir 12 temos: dažniai, diagramos, imties centro matai,
  // galimybių medis ir lentelė, tikimybė.
  'daznu-lentele': daznuLentele6,
  'stulpeline-diagrama-6': stulpelineDiagrama6,
  'linijine-diagrama-6': linijineDiagrama6,
  'imties-vidurkis-6': imtiesVidurkis6,
  'imties-mediana': imtiesMediana,
  'imties-moda': imtiesModa,
  'galimybiu-medis': galimybiuMedis6,
  'galimybiu-lentele': galimybiuLentele6,
  'daugybos-taisykle': daugybosTaisykle,
  'ivykis-6': ivykis6,
  'ivykio-tikimybe-6': ivykioTikimybe6,
  'priesingas-ivykis': priesingasIvykis,

  // 7 klasė. 1 ir 2 temos: teiginiai, įrodymas, laipsniai.
  'teisingi-klaidingi-teiginiai': teisingiKlaidingiTeiginiai,
  'aksioma-apibrezimas-teorema': aksiomaApibrezimasTeorema,
  'irodymas': irodymas,
  'kvadratu-ir-kubu': kvadratuIrKubu,
  'laipsnis-naturalusis-rodiklis': laipsnisNaturalusisRodiklis,
  'laipsniai-vienodi-pagrindai': laipsniaiVienodiPagrindai,
  'laipsniai-vienodi-rodikliai': laipsniaiVienodiRodikliai,
  'laipsni-keliame-laipsniu': laipsniKeliameLaipsniu,
  'neigiamas-rodiklis': neigiamasRodiklis,
  'neigiamo-rodiklio-savybes': neigiamoRodiklioSavybes,
  'standartine-israiska': standartineIsraiska,

  // 7 klasė. 3, 4 ir 5 temos: procentai, nelygybės, atvirkštinis proporcingumas.
  // Kartu ir programos potemė „Biudžetas, finansiniai tikslai ir paskolų
  // pasiūlymų palyginimas“ — ji remiasi tais pačiais palūkanų skaičiavimais.
  'kiek-procentu-pakito': kiekProcentuPakito,
  'dydis-po-pokycio': dydisPoPokycio,
  'paprastosios-palukanos': paprastosiosPalukanos,
  'sudetines-palukanos': sudetinesPalukanos,
  'sudetiniai-procentai': sudetiniaiProcentai,
  'biudzetas-ir-paskolos': biudzetasIrPaskolos,
  'skaiciu-palyginimas-7': skaiciuPalyginimas7,
  'skaiciu-intervalai': skaiciuIntervalai,
  'nelygybe-pridedame': nelygybePridedame,
  'nelygybe-dauginame': nelygybeDauginame,
  'nelygybes-sprendinys': nelygybesSprendinys,
  'vieno-zingsnio-nelygybes': vienoZingsnioNelygybes,
  'paprastos-nelygybes': paprastosNelygybes,
  'sudetingesnes-nelygybes': sudetingesnesNelygybes,
  'nelygybiu-sistema': nelygybiuSistema,
  'dvigubos-nelygybes': dvigubosNelygybes,
  'nelygybiu-tekstiniai': nelygybiuTekstiniai,
  'susije-dydziai': susijeDydziai,
  'atvirksciai-proporcingi': atvirksciaiProporcingi,
  'atvirkstinio-grafikas': atvirkstinioGrafikas,
  'atvirkstinio-tekstiniai': atvirkstinioTekstiniai,

  // 7 klasė. 6 ir 7 temos: tiesės, trikampiai ir keturkampiai. Kartu ir
  // programos potemė „Konstravimas ir transformacijos koordinačių plokštumoje“.
  'taskas-ir-tiese': taskasIrTiese,
  'susikertancios-tieses': susikertanciosTieses,
  'lygiagrecios-tieses': lygiagreciosTieses,
  'lygiagretumo-pozymiai': lygiagretumoPozymiai,
  'kampai-su-kirstine': kampaiSuKirstine,
  'konstravimas-plokstumoje': konstravimasPlokstumoje,
  'trikampiu-rusys': trikampiuRusys,
  'trikampio-aukstines': trikampioAukstines,
  'trikampio-pusiaukrastines': trikampioPusiaukrastines,
  'trikampio-pusiaukampines': trikampioPusiaukampines,
  'lygiagretainis-7': lygiagretainis7,
  'staciakampis-7': staciakampis7,
  'rombas-7': rombas7,
  'kvadratas-7': kvadratas7,
  'trapecija-7': trapecija7,
  'trapeciju-rusys': trapecijuRusys,
  'daugiakampiai-plokstumoje': daugiakampiaiPlokstumoje,

  // 7 klasė. 8 ir 9 temos: plotai, apskritimas ir skritulys. Su π klausiama
  // koeficiento arba apytikslės reikšmės — kitaip atsakymo suvesti neįmanoma.
  'pagrindiniu-figuru-plotai': pagrindiniuFiguruPlotai,
  'trikampio-plotas-7': trikampioPlotas7,
  'lygiagretainio-plotas': lygiagretainioPlotas,
  'rombo-plotas': romboPlotas,
  'trapecijos-plotas': trapecijosPlotas,
  'apskritimas-7': apskritimas7,
  'apskritimo-ilgis': apskritimoIlgis,
  'apskritimo-lankas': apskritimoLankas,
  'skritulio-plotas': skritulioPlotas,

  // 7 klasė. 10, 11 ir 12 temos: prizmė ir piramidė, ritinys ir kūgis, duomenys.
  'tieses-ir-plokstumos': tiesesIrPlokstumos,
  'stacioji-prizme': staciojiPrizme7,
  'prizmes-turis': prizmesTuris,
  'piramide-7': piramide7,
  'piramides-turis': piramidesTuris,
  'ritinys-7': ritinys7,
  'ritinio-plotas-turis': ritinioPlotasTuris,
  'kugis-7': kugis7,
  'kugio-plotas-turis': kugioPlotasTuris,
  'statistinis-tyrimas': statistinisTyrimas,
  'imtis-atsitiktine': imtisAtsitiktine,
  'imciu-rusys': imciuRusys,
  'statistinis-kintamasis': statistinisKintamasis,
  'skritulines-diagramos': skritulinesDiagramos,

  // 8 klasė. 1 ir 2 temos: kvadratinė ir kubinė šaknys, skaičių aibės.
  // Kur šaknis neišsitraukia, klausiama koeficiento arba pošaknio — kitaip
  // iracionalaus atsakymo suvesti neįmanoma.
  'kvadratine-saknis': kvadratineSaknis,
  'kubine-saknis': kubineSaknis,
  'iracionalieji-skaiciai': iracionaliejiSkaiciai,
  'saknu-palyginimas': saknuPalyginimas,
  'saknu-sudetis': saknuSudetis,
  'saknis-is-sandaugos': saknisIsSandaugos,
  'saknis-is-trupmenos': saknisIsTrupmenos,
  'iskeliame-ikeliame': iskeliameIkeliame,
  'skaitiniai-su-saknimis': skaitiniaiSuSaknimis,
  'raidiniai-su-saknimis': raidiniaiSuSaknimis,
  'skaiciu-aibes-8': skaiciuAibes8,
  'aibes-poaibis': aibesPoaibis,
  'realieji-skaiciai': realiejiSkaiciai,
  'veiksmai-su-realiaisiais': veiksmaiSuRealiaisiais,

  // 8 klasė. 3 ir 4 temos: finansiniai skaičiavimai, reiškiniai. Kartu ir
  // programos potemė „Dvinario kvadrato išskyrimas“.
  'valiutu-kursai': valiutuKursai,
  'palukanu-rusys': palukanuRusys,
  'palukanos-ir-grafikai': palukanosIrGrafikai,
  'pirkimas-issimoketinai': pirkimasIssimoketinai,
  'mazejancios-palukanos': mazejanciosPalukanos,
  'vienanaris-daugianaris': vienanarisDaugianaris,
  'atskliautimas-8': atskliautimas8,
  'daugianariu-daugyba': daugianariuDaugyba,
  'dvinario-kvadratas': dvinarioKvadratas,
  'sumos-ir-skirtumo-sandauga': sumosIrSkirtumoSandauga,
  'bendrojo-daugiklio-iskelimas': bendrojoDaugiklioIskelimas,
  'skaidymas-grupavimu': skaidymasGrupavimu,
  'skaidymas-formulemis': skaidymasFormulemis,
  'dvinario-kvadrato-isskyrimas': dvinarioKvadratoIsskyrimas,

  // 8 klasė. 5 ir 6 temos: tiesinių lygčių sistemos, vektoriai. Kartu ir
  // programos potemė „Tiesinis sąryšis: lentelė, formulė ir grafikas“.
  'tiesine-lygtis-dviem': tiesineLygtisDviem,
  'tiesines-lygties-grafikas': tiesinesLygtiesGrafikas,
  'lygciu-sistema-8': lygciuSistema8,
  'sistemos-sprendiniu-skaicius': sistemosSprendiniuSkaicius,
  'sistemos-keitimo-budu': sistemosKeitimoBudu,
  'sistemos-sulyginimo-budu': sistemosSulyginimoBudu,
  'sistemos-sudeties-budu': sistemosSudetiesBudu,
  'sistemu-judejimo-uzdaviniai': sistemuJudejimoUzdaviniai,
  'sistemu-tekstiniai': sistemuTekstiniai,
  'tiesinis-sarysis': tiesinisSarysis,
  'vektoriaus-savoka': vektoriausSavoka,
  'vektoriu-lygumas': vektoriuLygumas,
  'vektoriu-sudetis': vektoriuSudetis,
  'vektoriu-atimtis': vektoriuAtimtis,
  'vektoriaus-daugyba': vektoriausDaugyba,

  // 8 klasė. 7 ir 8 temos: plokštumos figūros, erdviniai kūnai. Kartu ir
  // programos potemė apie objekto vaizdus bei mastelį.
  'pitagoro-teorema': pitagoroTeorema,
  'atvirkstine-pitagoro': atvirkstinePitagoro,
  'atstumas-tarp-tasku': atstumasTarpTasku,
  'statinis-pries-30': statinisPries30,
  'lygiasonis-lygiakrastis': lygiasonisLygiakrastis,
  'trikampio-vidurio-linija': trikampioVidurioLinija,
  'trapecijos-vidurio-linija': trapecijosVidurioLinija,
  'stacioji-prizme-8': staciojiPrizme8,
  'taisyklingoji-piramide-8': taisyklingojiPiramide8,
  'ritinys-8': ritinys8,
  'kugis-8': kugis8,
  'rutulys-ir-sfera': rutulysIrSfera,
  'objekto-vaizdai-mastelis': objektoVaizdaiMastelis,

  // 8 klasė. 9 tema: duomenys.
  'empirinis-skirstinys': empirinisSkirstinys,
  'sukauptieji-dazniai': sukauptiejiDazniai,
  'sugrupuotu-diagrama': sugrupuotuDiagrama,
  'histograma-8': histograma8,
  'imties-charakteristikos': imtiesCharakteristikos,
  'kvartiliai': kvartiliai,
  'usu-diagrama': usuDiagramaUzd,

  // 8 klasė. 10 tema: progimnazijos kurso kartojimo medžiaga.
  'kartojimas-aibes': kartojimasAibes,
  'kartojimas-dalumas': kartojimasDalumas,
  'kartojimas-veiksmai': kartojimasVeiksmai,
  'kartojimas-trupmenos': kartojimasTrupmenos,
  'kartojimas-proporcingumas': kartojimasProporcingumas,
  'kartojimas-procentai': kartojimasProcentai,
  'kartojimas-laipsniai': kartojimasLaipsniai,
  'kartojimas-raidiniai': kartojimasRaidiniai,
  'kartojimas-lygtys': kartojimasLygtys,
  'kartojimas-nelygybes': kartojimasNelygybes,
  'kartojimas-kampai': kartojimasKampai,
  'kartojimas-trikampiai': kartojimasTrikampiai,
  'kartojimas-keturkampiai': kartojimasKeturkampiai,
  'kartojimas-apskritimas': kartojimasApskritimas,
  'kartojimas-vektoriai': kartojimasVektoriai,
  'kartojimas-simetrija': kartojimasSimetrija,
  'kartojimas-kunai': kartojimasKunai,
  'kartojimas-statistika': kartojimasStatistika,
  'kartojimas-tikimybes': kartojimasTikimybes,

  // 9 klasė. 1 ir 2 temos: funkcijos, sekos, tiesinė funkcija. Kartu ir
  // programos potemė „Funkcijos apibrėžimo ir reikšmių sritys“.
  'susije-dydziai-9': susijeDydziai9,
  'funkcija-ir-grafikas': funkcijaIrGrafikas,
  'funkcijos-savybes': funkcijosSavybes,
  'skaiciu-seka': skaiciuSeka,
  'rekurentines-sekos': rekurentinesSekos,
  'apibrezimo-sritis': apibrezimoSritis,
  'tiesioginis-proporcingumas': tiesioginisProporcingumas,
  'tiesine-funkcija-9': tiesineFunkcija9,
  'tiesines-funkcijos-savybes': tiesinesFunkcijosSavybes,
  'dvieju-tiesiu-padetis': dviejuTiesiuPadetis,

  // 9 klasė. 3 ir 4 temos: kvadratinė lygtis, kvadratinė funkcija.
  'kvadratines-lygties-samprata': kvadratinesLygtiesSamprata,
  'nepilnosios-kvadratines': nepilnosiosKvadratines,
  'pilnoji-kvadratine': pilnojiKvadratine,
  'sprendiniu-formules': sprendiniuFormules,
  'trinario-skaidymas': trinarioSkaidymas,
  'vijeto-teorema': vijetoTeorema,
  'kvadratines-funkcijos-samprata': kvadratinesFunkcijosSamprata,
  'grafiko-transformacijos': grafikoTransformacijos,
  'kvadratines-funkcijos-savybes': kvadratinesFunkcijosSavybes,

  // 9 klasė. 5 ir 6 temos: trupmeniniai racionalieji reiškiniai, lygčių sistemos.
  'trupmeninio-reiskinio-samprata': trupmeninioReiskinioSamprata,
  'trupmenu-daugyba-dalyba': trupmenuDaugybaDalyba,
  'trupmenu-sudetis-atimtis': trupmenuSudetisAtimtis,
  'trupmeniniai-sudetingesni': trupmeniniaiSudetingesni,
  'sistemos-algebriskai': sistemosAlgebriskai,
  'sistemos-grafiskai': sistemosGrafiskai,
  'sistemos-sudetingesnes': sistemosSudetingesnes,

  // 9 klasė. 7 tema: įvadas į trigonometriją.
  'sinusas-kosinusas-tangentas': sinusasKosinusasTangentas,
  'trigonometrines-reiksmes': trigonometrinesReiksmes,
  'skaiciuotuvas-trigonometrija': skaiciuotuvasTrigonometrija,
  'trigonometrines-formules': trigonometrinesFormules,
  'staciuju-trikampiu-sprendimas': staciujuTrikampiuSprendimas,

  // 9 klasė. 8 tema: apskritimas ir skritulys.
  'liestine-ir-kirstine': liestineIrKirstine,
  'centrinis-ir-ibreztinis': centrinisIrIbreztinis,
  'stygu-savybes': styguSavybes,
  'ispjova-ir-nuopjova': ispjovaIrNuopjova,
  'proporcingos-atkarpos': proporcingosAtkarpos,

  // 9 klasė. 9 tema: duomenys ir jų interpretavimas. Kartu ir programos
  // potemės apie imties dydį bei koreliacijos ir priežasties skirtumą.
  'sklaidos-diagrama': sklaidosDiagramaUzd,
  'tiesine-koreliacija': tiesineKoreliacija,
  'tiese-sklaidos-diagramoje': tieseSklaidosDiagramoje,
  'imties-dydzio-itaka': imtiesDydzioItaka,
  'koreliacija-ne-priezastis': koreliacijaNePriezastis,

  // 10 klasė. 1 tema: trupmeninė racionalioji lygtis.
  'trupmenines-lygties-samprata': trupmeninesLygtiesSamprata,
  'trupmena-lygi-nuliui': trupmenaLygiNuliui,
  'trupmeniniu-lygciu-budai': trupmeniniuLygciuBudai,
  'judejimo-uzdaviniai-10': judejimoUzdaviniai10,
  'darbo-uzdaviniai': darboUzdaviniai,
  'misiniu-uzdaviniai': misiniuUzdaviniai,

  // 10 klasė. 2 tema: trigonometrijos pagrindai.
  'posukio-kampas': posukioKampas,
  'trigonometrines-reiksmes-10': trigonometrinesReiksmes10,
  'trikampio-plotas-sinusu': trikampioPlotasSinusu,
  'sinusu-teorema': sinusuTeorema,
  'kosinusu-teorema': kosinusuTeorema,

  // 10 klasė. 3 tema: lygčių su dviem nežinomaisiais sistemos.
  'sistemos-samprata': sistemosSamprata,
  'atvirkstinis-proporcingumas': atvirkstinisProporcingumas,
  'sistemos-grafiskai-10': sistemosGrafiskai10,
  'sistemos-algebriskai-10': sistemosAlgebriskai10,
  'sistemu-uzdaviniai': sistemuUzdaviniai,
  'sistemos-keitiniai': sistemosKeitiniai,

  // 10 klasė. 4 tema: nelygybės ir jų sistemos.
  'kvadratines-nelygybes-samprata': kvadratinesNelygybesSamprata,
  'nelygybe-parabole': nelygybeParabole,
  'nelygybe-sistemomis': nelygybeSistemomis,
  'nelygybiu-taikymas': nelygybiuTaikymas,
  'nelygybiu-sistemos': nelygybiuSistemos,
  'trupmenines-nelygybes': trupmeninesNelygybes,

  // 10 klasė. 5 tema: dėsningumai, santykiai ir procentai.
  'trukstama-informacija': trukstamaInformacija,
  'proporcinga-dalyba': proporcingaDalyba,
  'fibonacio-seka': fibonacioSeka,
  'aukso-pjuvis': auksoPjuvis,
  'sudetiniai-procentai-10': sudetiniaiProcentai10,
  'dziovinimo-uzdaviniai': dziovinimoUzdaviniai,
  'lydiniai-tirpalai': lydiniaiTirpalai,

  // 10 klasė. 6 tema: plokštumos figūros.
  'panasumo-santykiai': panasumoSantykiai,
  'pusiaukampiniu-savybes': pusiaukampiniuSavybes,
  'pusiaukrastiniu-savybes': pusiaukrastiniuSavybes,
  'ibreztas-apskritimas': ibreztasApskritimas,
  'apibreztas-apskritimas': apibreztasApskritimas,
  'ploto-formules-rp': plotoFormulesRp,
  'ibreztiniai-keturkampiai': ibreztiniaiKeturkampiai,
  'geometriniai-irodymai': geometriniaiIrodymai,

  // 10 klasė. 7 tema: duomenys ir jų interpretavimas.
  'populiacija-ir-imtis': populiacijaIrImtis,
  'duomenu-kintamumas': duomenuKintamumas,
  'dispersija-nuokrypis': dispersijaNuokrypis,
  'skirstiniu-formos': skirstiniuFormos,
  'centro-ir-sklaidos-interpretavimas': centroIrSklaidosInterpretavimas,
  'statistinis-patikimumas': statistinisPatikimumas,

  // 10 klasė. 8 tema: rinkiniai, kombinatorika ir tikimybės.
  'elementu-rinkiniai': elementuRinkiniai,
  'elementu-tvarka': elementuTvarka,
  'rinkiniu-skaicius': rinkiniuSkaicius,
  'sudeties-taisykle': sudetiesTaisykle,
  'daugybos-taisykle-10': daugybosTaisykle10,
  'teorine-eksperimentine': teorineEksperimentine,
  'ilgalaikis-daznis': ilgalaikisDaznis,

  // Duomenys ir tikimybės
  vidurkis,
  tikimybe,
  kombinatorika,
  diagramos,
}

/**
 * Temos, iš kurių sudaromas mišrus pasiruošimo PUPP rinkinys.
 * Tai ne NŠA užduotis, o mūsų uždaviniai iš tų pačių turinio sričių.
 */
const PUPP_TEMOS = [
  'trupmenu-sudetis',
  'procentai',
  'neigiami',
  'tiesines-lygtys',
  'proporcijos',
  'laipsniai',
  'saknys',
  'greitosios-formules',
  'lygciu-sistemos',
  'kvadratines-lygtys',
  'funkcijos',
  'pitagoras',
  'plotas-turis',
  'trigonometrija',
  'vidurkis',
  'tikimybe',
] as const

generatoriai.pupp = (lygis, klase) => {
  const vardas = PUPP_TEMOS[Math.floor(atsitiktinumas() * PUPP_TEMOS.length)]
  return generatoriai[vardas](lygis, klase ?? 10)
}

/** Ar toks generatorius egzistuoja. */
export function arYraGeneratorius(vardas: string): boolean {
  return vardas in generatoriai
}

/** Kiek kartų persukama, kol pasitaiko į sritį telpantis uždavinys. */
const MAKS_SRITIES_BANDYMU = 40

/**
 * Vienas uždavinys iš nurodyto generatoriaus.
 *
 * Sritis tikrinama čia, o ne kiekviename generatoriuje, dėl dviejų priežasčių:
 * ji galioja ir tiems generatoriams, kurie apie ją nieko nežino, ir tikrinimas
 * lieka vienoje vietoje. Neradus tinkamo per `MAKS_SRITIES_BANDYMU` kartų
 * grąžinamas paskutinis bandymas — svetainė nelūžta, o `npm run patikra`
 * tokį atvejį paverčia klaida, todėl nepastebėtas jis neišeina.
 */
export function generuok(
  vardas: string,
  lygis: Lygis,
  klase?: number,
  sritis?: Sritis | null,
): Uzdavinys {
  const g = generatoriai[vardas]
  if (!g) throw new Error(`Nežinomas generatorius: ${vardas}`)

  const riba = sritis === undefined ? sritisKlasei(klase) : sritis
  if (!riba) return g(lygis, klase, null)

  let paskutinis = g(lygis, klase, riba)
  for (let i = 0; i < MAKS_SRITIES_BANDYMU; i += 1) {
    if (uzRibos(paskutinis, riba).length === 0) return paskutinis
    paskutinis = g(lygis, klase, riba)
  }
  return paskutinis
}

/**
 * Kelių uždavinių rinkinys iš to paties generatoriaus.
 *
 * Du dalykai, kurių anksčiau trūko:
 *
 * 1. Pavidalų eilė. Be jos generatorius su septyniais pavidalais dešimties
 *    uždavinių rinkinyje realiai panaudodavo tris.
 * 2. Tapatybė pagal šabloną, ne pagal eilutę. „Koks skaičius eina prieš pat
 *    2028?“ ir „…4385?“ yra tas pats uždavinys; `Set` su tikslia eilute jų
 *    neatskirdavo ir praleisdavo abu.
 *
 * Šablonų kartojimas leidžiamas tik tada, kai generatorius skirtingų
 * paprasčiausiai nebeturi — kitaip rinkinys būtų trumpesnis nei prašyta.
 */
export function generuokRinkini(
  vardas: string,
  lygis: Lygis,
  kiek: number,
  klase?: number,
  sritis?: Sritis | null,
): Uzdavinys[] {
  const rinkinys: Uzdavinys[] = []
  const sablonai = new Set<string>()
  const tikslus = new Set<string>()

  pavidaluEile(Math.floor(atsitiktinumas() * 7))
  try {
    // 1 ratas — tik nauji šablonai.
    for (let i = 0; i < kiek * 12 && rinkinys.length < kiek; i += 1) {
      const u = generuok(vardas, lygis, klase, sritis)
      const s = sablonas(u.klausimas)
      if (sablonai.has(s)) continue
      sablonai.add(s)
      tikslus.add(u.klausimas + (u.brezinys ?? ''))
      rinkinys.push(u)
    }

    // 2 ratas — šablonai jau išsemti, tad užtenka, kad skirtųsi pats uždavinys.
    // Brėžininiuose uždaviniuose klausimo tekstas dažnai vienodas („Kokia taško A
    // abscisė?"), o skiriasi tik piešinys — tad tapatybė yra abu kartu.
    for (let i = 0; i < kiek * 20 && rinkinys.length < kiek; i += 1) {
      const u = generuok(vardas, lygis, klase, sritis)
      const raktas = u.klausimas + (u.brezinys ?? '')
      if (tikslus.has(raktas)) continue
      tikslus.add(raktas)
      rinkinys.push(u)
    }

    // Jei generatorius neturi tiek skirtingų variantų, papildom kartojimais.
    while (rinkinys.length < kiek) {
      rinkinys.push(generuok(vardas, lygis, klase, sritis))
    }
  } finally {
    pavidaluEile(null)
  }

  return rinkinys
}

/**
 * Kiek uždavinių atitenka kiekvienai potemei.
 *
 * Kai uždavinių ne mažiau nei potemių, kiekviena gauna bent po vieną, o
 * likutis išdalijamas atsitiktinėms — kitaip papildomi uždaviniai visada
 * tektų temos pradžiai.
 *
 * Kai uždavinių mažiau nei potemių, aprėpti visų neįmanoma; tada potemės
 * skirstomos į tiek ruožų, kiek yra uždavinių, ir iš kiekvieno ruožo imama po
 * vieną. Taip trumpas rinkinys vis tiek apeina visą temą — nuo pradžios iki
 * pabaigos, o ne pirmas penkias potemes.
 */
function kvotosPotemems(potemiu: number, kiek: number): number[] {
  const kvotos = Array.from({ length: potemiu }, () => 0)
  if (potemiu === 0 || kiek <= 0) return kvotos

  if (kiek < potemiu) {
    for (let i = 0; i < kiek; i += 1) {
      const nuo = Math.floor((i * potemiu) / kiek)
      const iki = Math.floor(((i + 1) * potemiu) / kiek)
      kvotos[nuo + Math.floor(atsitiktinumas() * Math.max(1, iki - nuo))] = 1
    }
    return kvotos
  }

  kvotos.fill(Math.floor(kiek / potemiu))
  const eile = kvotos.map((_, i) => i)
  for (let i = eile.length - 1; i > 0; i -= 1) {
    const j = Math.floor(atsitiktinumas() * (i + 1))
    ;[eile[i], eile[j]] = [eile[j], eile[i]]
  }
  for (let i = 0; i < kiek % potemiu; i += 1) kvotos[eile[i]] += 1
  return kvotos
}

/**
 * Visos temos rinkinys — po uždavinį iš kiekvienos jos potemės.
 *
 * Skiriasi nuo `generuokRinkini` tuo, kad ima ne vieną generatorių, o visą
 * temos sąrašą. Uždaviniai eina programos tvarka, tad lapas apeina temą nuo
 * pirmos potemės iki paskutinės.
 *
 * Kartojimų vengiama per visą rinkinį, o ne kiekvienoje potemėje atskirai:
 * dvi potemės gali dalytis generatoriumi arba klausimo pavidalu, ir tada tas
 * pats uždavinys lape atsidurtų du kartus.
 */
export function generuokTemosRinkini(
  vardai: readonly string[],
  lygis: Lygis,
  kiek: number,
  klase?: number,
  sritis?: Sritis | null,
): Uzdavinys[] {
  const unikalus = [...new Set(vardai)].filter((v) => v in generatoriai)
  if (unikalus.length === 0) return []
  if (unikalus.length === 1) return generuokRinkini(unikalus[0], lygis, kiek, klase, sritis)

  const kvotos = kvotosPotemems(unikalus.length, kiek)
  const rinkinys: Uzdavinys[] = []
  const matyti = new Set<string>()

  unikalus.forEach((vardas, i) => {
    const norima = kvotos[i]
    if (norima === 0) return
    let pridėta = 0

    for (const u of generuokRinkini(vardas, lygis, norima, klase, sritis)) {
      const raktas = u.klausimas + (u.brezinys ?? '')
      if (matyti.has(raktas)) continue
      matyti.add(raktas)
      rinkinys.push(u)
      pridėta += 1
    }

    // Dubliai su ankstesnėmis potemėmis atėmė uždavinių — papildom iš tos
    // pačios potemės, kad ji vis tiek gautų jai skirtą kvotą.
    for (let b = 0; pridėta < norima && b < norima * 12; b += 1) {
      const u = generuok(vardas, lygis, klase, sritis)
      const raktas = u.klausimas + (u.brezinys ?? '')
      if (matyti.has(raktas)) continue
      matyti.add(raktas)
      rinkinys.push(u)
      pridėta += 1
    }
  })

  return rinkinys
}
