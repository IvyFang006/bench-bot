import { Button } from "@/components/ui/button";
import { PacMan, Ghost, Dot, Cherry } from "@/components/ArcadeIcons";

interface SuccessPageProps {
  playerName: string;
}

function generateTicketId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `TKT-8BIT-2026-${suffix}`;
}

export function SuccessPage({ playerName }: SuccessPageProps) {
  const ticketId = generateTicketId();

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-4 py-12">
      {/* Pac-Man dot trail */}
      <div className="flex items-center gap-2 mb-6">
        <Dot size={5} />
        <Dot size={5} />
        <Dot size={5} />
        <PacMan size={25} />
        <Dot size={5} />
        <Dot size={5} />
        <Dot size={5} />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-pixel text-3xl text-[#ffd709] leading-loose">
          報名成功
        </h1>
      </div>

      {/* Ticket card - white panel in dark world */}
      <div className="w-full max-w-sm relative">
        {/* Top notch cutouts */}
        <div className="absolute -left-3 top-[0px] w-6 h-6 bg-[#131313] rounded-full" />
        <div className="absolute -right-3 top-[0px] w-6 h-6 bg-[#131313] rounded-full" />

        <div className="bg-[#ffffff] overflow-hidden shadow-[0_0_30px_rgba(255,215,9,0.1)]">
          {/* Event type section */}
          <div className="px-6 pt-8 pb-5 border-b border-dashed border-[#abadae]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🏀</span>
                <span className="text-xl font-bold text-[#2c2f30]">2026 全國大專女籃校友盃</span>
              </div>
            </div>
          </div>

          {/* Player name */}
          <div className="px-6 pt-5 pb-5 border-b border-dashed border-[#abadae]/30">
            <p className="font-pixel text-sm text-[#595c5d] tracking-wider mb-2">
              參賽球員
            </p>
            <p className="text-3xl font-bold tracking-[-0.02em] text-[#2c2f30]">
              {playerName}
            </p>
          </div>

          {/* Team */}
          <div className="px-6 pt-5 pb-5 border-b border-dashed border-[#abadae]/30">
            <p className="font-pixel text-sm text-[#595c5d] tracking-wider mb-2">
              參賽隊伍
            </p>
            <p className="text-base font-bold tracking-[-0.02em] text-[#2c2f30]">
              {import.meta.env.VITE_SCHOOL_NAME}
            </p>
          </div>

          {/* Match dates */}
          <div className="px-6 pt-5 pb-5 border-b border-dashed border-[#abadae]/30">
            <p className="font-pixel text-sm text-[#595c5d] tracking-wider mb-2">
              比賽日期
            </p>
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <span className="text-base font-bold text-[#2c2f30]">2026/06/27 ~ 2026/06/28</span>
            </div>
          </div>

          {/* Venue */}
          <div className="px-6 pt-5 pb-5 border-b border-dashed border-[#abadae]/30">
            <p className="font-pixel text-sm text-[#595c5d] tracking-wider mb-2">
              比賽地點
            </p>
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <span className="text-base font-bold text-[#2c2f30]">中壢運動中心</span>
            </div>
          </div>

          {/* Ticket stub */}
          <div className="relative">
            <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#131313] rounded-full" />
            <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#131313] rounded-full" />

            <div className="px-6 pt-6 pb-8 bg-[#1b1b1b] flex flex-col items-center gap-3">
              {/* Pixel barcode */}
              <div className="flex items-center justify-center h-16 w-full">
                {[3,1,1,1,4,2,1,2,1,1,4,1,3,2,1,1,2,4,1,1,3,1,2,4,1,3,1,1,1,4,2,1,2,3,1,1,4,1,2,3,1,4,1,1,3,2,1,1,4,1,2,1,1,3,1,2,4,1,1,3,2,1,1,4,1,2,1,3].map((w, i) => (
                  <div
                    key={i}
                    className={i % 2 === 0 ? "bg-[#ffd709]" : "bg-transparent"}
                    style={{ width: `${w}px`, height: "100%" }}
                  />
                ))}
              </div>
              <p className="font-pixel text-[8px] tracking-[0.2em] text-[#ffd709]">
                {ticketId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="w-full max-w-sm mt-8">
        <Button
          size="lg"
          className="w-full h-14 text-base"
          onClick={() => window.location.reload()}
        >
          回上一頁
        </Button>
      </div>

      {/* Arcade decoration */}
      <div className="flex justify-center items-center gap-4 mt-8 ">
        <Ghost size={25} color="#ff8fa9" />
        <Ghost size={25} color="#54e3fc" />
        <Cherry size={25} />
        <Ghost size={25} color="#ffd709" />
        <Ghost size={25} color="#f95630" />
      </div>
    </div>
  );
}
