'use client';

import {useId, useMemo} from 'react';
import {createBoardMesh} from '@/lib/board-model';
import {configuredWidth, type Configuration, type Product} from '@/lib/catalog';

type Point = [number, number];

/** A fixed, shallow projection of the order geometry; no interactive 3D scene. */
export function boardPreviewGeometry(p: Product, c: Configuration) {
  const mesh = createBoardMesh(p, c);
  const shear = .16;
  const foreshortening = .78;
  const scale = Math.min(610 / (mesh.length + mesh.width * shear), 200 / (mesh.width * foreshortening));
  const center: Point = [367, 192];
  const project = ([x, y]: Point): Point => [center[0] + (x + y * shear) * scale, center[1] + y * foreshortening * scale];
  const path = (ring: Point[]) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? 'L' : 'M'}${x.toFixed(3)},${y.toFixed(3)}`;
  }).join(' ') + ' Z';
  // The illustration keeps the size envelope and selected cut straight, while a
  // small seeded contour makes the unfinished long edges legible at phone size.
  const half = mesh.outline.length / 2;
  const phase = (mesh.seed % 1000) / 1000 * Math.PI * 2;
  const outlinePoints: Point[] = mesh.outline.map(([x, y], index) => {
    const back = index < half;
    if (c.cut && c.side === (back ? 'left' : 'right')) return [x, y];
    const along = x + mesh.length / 2;
    const wave = Math.sin(along * 11 + phase + (back ? 0 : 1.8)) * .018
      + Math.sin(along * 29 + phase * 1.4) * .007;
    const inset = mesh.width * (.037 + wave);
    return [x, (back ? -1 : 1) * (mesh.width / 2 - inset)];
  });
  const outline = path(outlinePoints);
  const holes = mesh.holes.map(path);
  const shape = [outline, ...holes].join(' ');
  const corners = {
    backLeft: project([-mesh.length / 2, -mesh.width / 2]),
    backRight: project([mesh.length / 2, -mesh.width / 2]),
    frontRight: project([mesh.length / 2, mesh.width / 2]),
  };
  return {mesh, scale, shear, foreshortening, center, outlinePoints, outline, holes, shape, corners, depth: mesh.thickness * scale * .62};
}

export function BoardPreview({p, c}: {p: Product; c: Configuration}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const geometry = useMemo(() => boardPreviewGeometry(p, c), [p, c]);
  const {mesh, scale, shear, foreshortening, center, outline, holes, shape, corners, depth} = geometry;
  const id = (name: string) => `board-${uid}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;
  const [backLeft, backRight, frontRight] = [corners.backLeft, corners.backRight, corners.frontRight];
  const dimensionY = backLeft[1] - 29;
  const sideOffset = 31;
  const widthLabelX = (backRight[0] + frontRight[0]) / 2 + sideOffset + 24;
  const caption = c.cut ? `Прямой спил: ${c.side === 'left' ? 'левая' : 'правая'} сторона` : 'Естественные края';
  const description = `Доска Кело: ${c.length} на ${configuredWidth(p, c)} сантиметров, толщина ${c.thickness} миллиметров. Верх и низ ровные и полированные. ${caption}. ${c.holes ? `Отверстий: ${c.holes}.` : 'Без отверстий.'} Демонстрационная схема; рисунок реальной доски отличается.`;

  return <svg className="board-preview quality-board-preview" viewBox="0 0 800 390" role="img" aria-labelledby={id('title')} aria-describedby={id('description')}>
    <title id={id('title')}>{`Доска ${c.length} × ${configuredWidth(p, c)} см · ${c.thickness} мм`}</title>
    <desc id={id('description')}>{description}</desc>
    <defs>
      <clipPath id={id('face')}><path d={shape} fillRule="evenodd" clipRule="evenodd"/></clipPath>
      <clipPath id={id('side')}><path d={outline} transform={`translate(0 ${depth})`}/></clipPath>
      <linearGradient id={id('edge')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b39a76"/><stop offset=".62" stopColor="#867254"/><stop offset="1" stopColor="#51483b"/>
      </linearGradient>
      <linearGradient id={id('polish')} x1="0" y1="0" x2=".2" y2="1">
        <stop offset="0" stopColor="#fff4da" stopOpacity=".19"/><stop offset=".42" stopColor="#fff4da" stopOpacity="0"/><stop offset="1" stopColor="#473b29" stopOpacity=".08"/>
      </linearGradient>
      <linearGradient id={id('hole')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141210"/><stop offset="1" stopColor="#4d4030"/>
      </linearGradient>
      <filter id={id('shadow')} x="-15%" y="-40%" width="130%" height="200%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
    </defs>

    <g aria-hidden="true">
      <path d={outline} transform={`translate(0 ${depth + 13})`} fill="#000" opacity=".3" filter={paint('shadow')}/>
      <path d={outline} transform={`translate(0 ${depth})`} fill={paint('edge')} stroke="#514839" strokeWidth="1"/>
      <g clipPath={paint('side')} fill="none">
        <path d={outline} transform={`translate(0 ${depth * .6})`} stroke="#40372d" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="14 7 36 5 9 3"/>
      </g>

      <path d={shape} fill="#baa07c" fillRule="evenodd"/>
      <g clipPath={paint('face')}>
        <g transform={`matrix(1 0 ${shear} ${foreshortening} ${center[0]} ${center[1]})`}>
          {/* Crop only an interior patch: the source photo's backdrop never becomes wood.
              `slice` preserves grain proportions; length changes reveal/crop grain instead of stretching it. */}
          <svg x={-mesh.length * scale / 2} y={-mesh.width * scale / 2} width={mesh.length * scale} height={mesh.width * scale} viewBox="90 410 1350 180" preserveAspectRatio="xMinYMid slice" overflow="hidden">
            <image href="/images/board.webp" x="0" y="0" width="1536" height="1024" preserveAspectRatio="xMidYMid meet"/>
          </svg>
        </g>
        <path d={outline} fill={paint('polish')}/>
      </g>
      <path d={outline} fill="none" stroke="#e7cfaa" strokeOpacity=".6" strokeWidth="1.15"/>
      {holes.map((hole, index) => <path key={index} d={hole} fill={paint('hole')} stroke="#e8d4b4" strokeOpacity=".78" strokeWidth="1"/>)}

      <g className="board-dimension-lines" fill="none" strokeLinecap="round">
        <path d={`M${backLeft[0]},${dimensionY + 8}V${backLeft[1] - 7} M${backRight[0]},${dimensionY + 8}V${backRight[1] - 7}`} className="board-extension-lines"/>
        <path d={`M${backLeft[0]},${dimensionY}H${backRight[0]} M${backLeft[0] - 4},${dimensionY + 5}l8,-10 M${backRight[0] - 4},${dimensionY + 5}l8,-10`}/>
        <path d={`M${backRight[0] + 10},${backRight[1]}H${backRight[0] + sideOffset + 8} M${frontRight[0] + 10},${frontRight[1]}H${frontRight[0] + sideOffset + 8}`} className="board-extension-lines"/>
        <path d={`M${backRight[0] + sideOffset},${backRight[1]}L${frontRight[0] + sideOffset},${frontRight[1]} M${backRight[0] + sideOffset - 5},${backRight[1] - 3}l10,6 M${frontRight[0] + sideOffset - 5},${frontRight[1] - 3}l10,6`}/>
      </g>
      <text className="board-dimension-label" x={(backLeft[0] + backRight[0]) / 2} y={dimensionY - 14} textAnchor="middle">{c.length} см</text>
      <text className="board-dimension-label" x={widthLabelX} y={center[1]} textAnchor="middle" transform={`rotate(-90 ${widthLabelX} ${center[1]})`}>{configuredWidth(p, c)} см</text>
      <text className="board-caption" x="400" y="359" textAnchor="middle">{caption} · {c.thickness} мм{c.holes ? ` · ${c.holes} отверстия` : ''}</text>
    </g>
  </svg>;
}
