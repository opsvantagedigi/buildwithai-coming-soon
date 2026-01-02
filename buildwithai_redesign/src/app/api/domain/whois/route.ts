import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { success: false, error: "INVALID_DOMAIN" },
        { status: 400 }
      )
    }

    const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`

    const rdapRes = await fetch(rdapUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    if (!rdapRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "RDAP_ERROR",
          status: rdapRes.status,
          message: `RDAP returned HTTP ${rdapRes.status}`,
        },
        { status: 502 }
      )
    }

    const data = await rdapRes.json()

    return NextResponse.json({
      success: true,
      domain,
      rdap: data,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "RDAP_EXCEPTION",
        message: err?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
